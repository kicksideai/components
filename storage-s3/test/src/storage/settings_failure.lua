local M = {}
M.result = nil
function M.get()
    return { open = function()
        return { get = function() return M.result, nil end }, nil
    end }, nil
end
return M
