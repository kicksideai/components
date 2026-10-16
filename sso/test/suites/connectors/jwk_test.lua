local test = require("test")
local crypto = require("crypto")
local jwk = require("sso_jwk")

-- Proves the hand-rolled JWK→SPKI-PEM DER encoder is correct: a JWT signed with a
-- fixed RSA private key verifies against the PEM derived from that key's JWK (n,e).
-- The keypair is a throwaway test fixture generated with openssl.
local PRIVATE_PEM = [[-----BEGIN RSA PRIVATE KEY-----
MIIEowIBAAKCAQEAtScB7idg2HV7z8lzxgUkVC7krsc6spvTfby2y1pLbB/GROiX
FMX/ZrTiCfy69h7PhP+uXbzw7+aDnK5SyQ8gwvWnxQt3vUQ1cTLqZmgSzsjxjfM3
BjnNfZaFd1oXIp0cPsJJBzLj7Kzohm/vW/Vf5DrfoUU1HvFDwyvnK6/6eVJhUbQa
frtMNsyRfSgRyNr6pMc0y9xkRCao+NnesVunjEs021ZOWXAM09ZJo8tB+f75DXTR
9RdosiiZecqrsp4R9FYQfpcemb8ruTFnta4OaHq0HCy1zsTN2XeVn67FB2bm3lAI
k2ijhiPiGN5+9J1ps2YfKO8ktaeNOYDgeWizFQIDAQABAoIBABe7losm6Y8yRRhB
4kMNJWdKBXfIbi48MAcHFEOr/rmZqBYbCsAT+JPyGrMIQ04/VxyriqKJQF+Nqax7
QilJLBeeq24rRHKtXvsHmqHz/JLOzKa2OH0+UWeksrOiP+mu/6ZROdQRnL7DIGuM
eqVnjjqOZAHy2TTGkwQc2lpk4cHHCn6fzJgV8Y6/NJeoP/U2GFgKwpG0eLzbxB4o
VIs2trWpT9T2wYSQOqElyf+KSQWUEaQAIO4178H0fVkuBuqX7vJNedkEDUCKYSMQ
tkO/hujVetZnQMewFM5kLisIkaNebw8BZ+qIDtQW37ZkCjiX/GTH4Y73lGGsTtgL
1BYFKkECgYEA7MusQbsUI5OG7uTzbb5YdjAlfvQcaWdzNE6lCP4LgN/v5uVVB020
dLmC02ap8OOzmax89zqcgLVAZyl6K+lJxt2cVa/H4kiLFiTm7oY1hXX0JTw5Stqc
HPybgpjmSj6h3cY2UDKICSOepLkOID181b0+U7MDPTwHRrvbkHd3mpkCgYEAw9gT
UcLNVXXejRnwjXTkRHdmxpXinObxUxgnhBPwYmnOh1GVB/m7Qqs4HcPUjbyik+mX
hWKOhqv6pMHfUJlcHmrahdcKrkGXQwkOBswwmWUgaxlfrJSaVavfVl/Z7oggYQIk
XesqJfqXQScrxHz63HN+Xskxg50lawjdx7GFRd0CgYEAqlA/wDMvY/s7BN5Vm+xZ
MgClJ2+qc8F9YfTizNn0KihnI3p1MsCX95BqYWSo/GK6DeC7LRLR99zlyo1Rmv27
G7bPN+4rZTzqFO5Lzulm22wgQxvS1VzxBgRGUaNpl6L+x0VGUV5W68Pb2fxkBZpU
DGOFzaumu8dOMHjzji/vLZkCgYAqz3L5rnGgOtHZWlBBO8oiRU+MHXuZ/MnH9kG9
F3a2rJZe8jB3u9l5a2Aq8YHnMdMALlHW8IJjYfi6Rz7/qWZ/p6/5Ddbh3KiqGLKe
Pchp37dEchl96kYKcDWz9eP3xn39drBob12ZS7wAnAVvQDq+Mejv418VfCaPzTJd
0qplaQKBgFJ1u3pOfOF4BerC27JAsRhniSWsABmQpU/l5wSlIT3CQHpMkn1LbW6C
sJ85AaokrwY8XS3+n5fZmikwDUMCo283+UoJtPMlDjsWGTl/3TjfGzSZRbtjsQZ9
yRFcSrnL3d3IDakZ+nPQ+Q8dOkN4aDGsdm7itTSpghSvr3pnspRK
-----END RSA PRIVATE KEY-----]]

local N = "tScB7idg2HV7z8lzxgUkVC7krsc6spvTfby2y1pLbB_GROiXFMX_ZrTiCfy69h7PhP-uXbzw7-aDnK5SyQ8gwvWnxQt3vUQ1cTLqZmgSzsjxjfM3BjnNfZaFd1oXIp0cPsJJBzLj7Kzohm_vW_Vf5DrfoUU1HvFDwyvnK6_6eVJhUbQafrtMNsyRfSgRyNr6pMc0y9xkRCao-NnesVunjEs021ZOWXAM09ZJo8tB-f75DXTR9RdosiiZecqrsp4R9FYQfpcemb8ruTFnta4OaHq0HCy1zsTN2XeVn67FB2bm3lAIk2ijhiPiGN5-9J1ps2YfKO8ktaeNOYDgeWizFQ"

local function define_tests()
    describe("jwk to_pem (RS256 round-trip)", function()
        it("derives a SPKI PEM that verifies a JWT signed by the matching key", function()
            local token, eerr = crypto.jwt.encode(
                { sub = "user-123", email = "a@b.com", aud = "client-xyz", iss = "https://issuer.test" },
                PRIVATE_PEM, "RS256"
            )
            test.is_nil(eerr)
            test.is_true(type(token) == "string" and #token > 0)

            local pem, perr = jwk.to_pem({ kty = "RSA", n = N, e = "AQAB" })
            test.is_nil(perr)
            assert(pem, "to_pem returned no key")
            test.is_true(pem:find("-----BEGIN PUBLIC KEY-----", 1, true) == 1)

            local claims, verr = crypto.jwt.verify(token, pem, "RS256", false)
            test.is_nil(verr)
            test.eq(claims.sub, "user-123")
            test.eq(claims.aud, "client-xyz")
            test.eq(claims.iss, "https://issuer.test")
        end)

        it("rejects a token tampered after signing", function()
            local token = crypto.jwt.encode({ sub = "x" }, PRIVATE_PEM, "RS256")
            local pem = jwk.to_pem({ kty = "RSA", n = N, e = "AQAB" })
            assert(pem, "to_pem returned no key")
            local tampered = token .. "x"
            local claims = crypto.jwt.verify(tampered, pem, "RS256", false)
            test.is_nil(claims)
        end)

        it("rejects a jwk missing modulus/exponent", function()
            local pem, err = jwk.to_pem({ kty = "RSA" })
            test.is_nil(pem)
            test.is_true(type(err) == "string")
        end)
    end)
end

return test.run_cases(define_tests)
