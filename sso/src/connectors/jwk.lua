-- JWT/JWKS helpers for OIDC id_token validation.
--
-- The runtime's crypto.jwt.verify accepts an RS256 PEM public key but there is no
-- built-in JWK→PEM conversion, so this builds the SubjectPublicKeyInfo DER from a
-- JWK's (n, e) and wraps it as a "PUBLIC KEY" PEM. DER encoding of an RSA public
-- key is standard and deterministic, so it is unit-tested against a known vector
-- (see test/connectors_test.lua).

local base64 = require("base64")
local json = require("json")
local http_client = require("http_client")
local util = require("sso_util")

local M = {}

-- AlgorithmIdentifier SEQUENCE for rsaEncryption (OID 1.2.840.113549.1.1.1, NULL).
local RSA_ALG_ID = string.char(
    0x30, 0x0d,
    0x06, 0x09, 0x2a, 0x86, 0x48, 0x86, 0xf7, 0x0d, 0x01, 0x01, 0x01,
    0x05, 0x00
)

local function der_length(n)
    if n < 0x80 then
        return string.char(n)
    end
    local bytes = {}
    while n > 0 do
        table.insert(bytes, 1, string.char(n % 256))
        n = math.floor(n / 256)
    end
    return string.char(0x80 + #bytes) .. table.concat(bytes)
end

local function der_tlv(tag, content)
    return string.char(tag) .. der_length(#content) .. content
end

-- der_uint encodes raw big-endian bytes as a DER INTEGER: strip leading zeros,
-- then prepend 0x00 if the high bit is set so the value stays positive.
local function der_uint(bytes)
    local i = 1
    while i < #bytes and bytes:byte(i) == 0 do i = i + 1 end
    bytes = bytes:sub(i)
    if #bytes > 0 and bytes:byte(1) >= 0x80 then
        bytes = string.char(0) .. bytes
    end
    return der_tlv(0x02, bytes)
end

-- to_pem converts an RSA JWK ({ n, e } base64url) into a SPKI "PUBLIC KEY" PEM.
function M.to_pem(jwk)
    if type(jwk) ~= "table" or type(jwk.n) ~= "string" or type(jwk.e) ~= "string" then
        return nil, "jwk missing n/e"
    end

    local n = util.base64url_decode(jwk.n)
    local e = util.base64url_decode(jwk.e)
    if not n or not e or n == "" or e == "" then
        return nil, "invalid jwk n/e"
    end

    local rsa_pubkey = der_tlv(0x30, der_uint(n) .. der_uint(e))
    local bit_string = der_tlv(0x03, string.char(0) .. rsa_pubkey)
    local spki = der_tlv(0x30, RSA_ALG_ID .. bit_string)

    local b64, err = base64.encode(spki)
    if err or not b64 then
        return nil, "failed to encode public key"
    end

    local lines = {}
    for i = 1, #b64, 64 do
        lines[#lines + 1] = b64:sub(i, i + 63)
    end
    return "-----BEGIN PUBLIC KEY-----\n" .. table.concat(lines, "\n") .. "\n-----END PUBLIC KEY-----\n"
end

-- decode_segment base64url-decodes one JWT segment and JSON-parses it.
function M.decode_segment(segment)
    local raw = util.base64url_decode(segment)
    if not raw then return nil, "malformed JWT segment" end
    local obj, err = json.decode(raw)
    if err then return nil, "malformed JWT JSON: " .. err end
    return obj
end

-- header returns the decoded JWT header (for the kid / alg).
function M.header(jwt)
    local dot = jwt:find(".", 1, true)
    if not dot then return nil, "malformed JWT" end
    return M.decode_segment(jwt:sub(1, dot - 1))
end

-- payload returns the decoded JWT claim set (the middle segment).
function M.payload(jwt)
    local first = jwt:find(".", 1, true)
    if not first then return nil, "malformed JWT" end
    local second = jwt:find(".", first + 1, true)
    if not second then return nil, "malformed JWT" end
    return M.decode_segment(jwt:sub(first + 1, second - 1))
end

-- pem_for_token fetches the JWKS and returns the PEM whose kid matches the token
-- header (or the first RSA key when the token carries no kid).
function M.pem_for_token(jwks_uri, jwt)
    if type(jwks_uri) ~= "string" or jwks_uri == "" then
        return nil, "no jwks_uri"
    end

    local hdr, herr = M.header(jwt)
    if herr then return nil, herr end
    local kid = type(hdr) == "table" and hdr.kid or nil

    local resp, err = http_client.get(jwks_uri, { headers = { ["Accept"] = "application/json" } })
    if err then return nil, "jwks fetch failed: " .. err end
    if resp.status_code >= 400 then
        return nil, "jwks http " .. tostring(resp.status_code)
    end

    local data, derr = json.decode(resp.body or "")
    if derr then return nil, "jwks parse failed: " .. derr end
    if type(data) ~= "table" or type(data.keys) ~= "table" then
        return nil, "jwks has no keys"
    end

    for _, k in ipairs(data.keys) do
        if type(k) == "table" and k.kty == "RSA" and (kid == nil or k.kid == kid) then
            return M.to_pem(k)
        end
    end
    return nil, "no matching jwk"
end

return M
