local legacy = require("legacy")
return require("migration").define(function()
    migration("02 transfer embedded storage ownership", function()
        local function transfer(db: any, engine: string): ()
            local _, err = legacy.run(db,engine)
            if err then error(tostring(err)) end
        end
        database("sqlite", function() up(function(db) transfer(db,"sqlite") end) end)
        database("postgres", function() up(function(db) transfer(db,"postgres") end) end)
    end)
end)
