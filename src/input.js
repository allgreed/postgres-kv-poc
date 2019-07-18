exports.validate_key = key => ! key.includes("\\")

const isObject = x => typeof x === 'object'
const isArray = x => x.constructor === Array
const isUndefined = x => typeof x === 'undefined'

const isNested = x => isObject(x) || isArray(x)

function deepValidate(obj)
{
    let nested = [obj];

    while (nested.length > 0)
    {
        nested_value = nested.pop()

        if (!nested_value) // null
            continue;

        values = isObject(nested_value)
            ? Object.values(nested_value)
            : nested_value

        for (value of values)
        {
            if(isUndefined(value))
            {
                return true;
            }
            else if(!isFinite(value))
            {
                return true;
            }
            else if (isNested(value))
            {
                nested.push(value)
            }
        }
    }

    return false;
}

exports.validate_value = value => isObject(value) && ! deepValidate(value);
