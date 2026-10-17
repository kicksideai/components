local test = require("test")
local registry = require("registry")

local function define_tests()
    test.describe("Transitive host bindings", function()
        test.it("attaches WebScout endpoints and assets to harness resources", function()
            local dependency, dependency_err = registry.get("app:dep.kickside.webscout")
            test.is_nil(dependency_err)
            test.not_nil(dependency)
            local parameters = {}
            for _, parameter in ipairs(dependency.data.parameters or {}) do
                parameters[parameter.name] = parameter.value
            end
            test.eq(parameters["kickside.webscout:api_router"], "app:api")
            test.eq(parameters["kickside.webscout:ui_server"], "app:gateway")
            local endpoint, endpoint_err = registry.get("kickside.webscout.api:list_providers.endpoint")
            test.is_nil(endpoint_err)
            test.not_nil(endpoint)
            test.eq(endpoint.meta.router, "app:api")
            local assets, assets_err = registry.get("kickside.webscout:ui_static")
            test.is_nil(assets_err)
            test.not_nil(assets)
            test.eq(assets.meta.server, "app:gateway")
        end)
    end)
end

local cases = test.run_cases(define_tests)
return { run = function(options) return cases(options) end }
