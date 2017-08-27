
/**
 * bindEnforceToState
 * @param  {Array}  [collection=[]] [description]
 * @param  {Object} [state={}]      [description]
 * @return {[type]}                 [description]
 */
export const bindState = (collection = [], state = {}) => {
  return collection.map(
    fn => typeof fn === 'function' ? fn.bind(state) : (function(){ return true }).bind(state)
  );
}
const combineState = (states = [], defaultState = {}) => {
  return states.reduce((state, next) => next && isObject(next) && Object.assign({}, state, next), defaultState)
}
export const makeStack = (collection) => Array.isArray(collection) ? collection : Object.values({
  ...collection
});

/**
 * takes a stateful object and a collection of functions
 * that should each return true or false and enforce a rule about the
 * predicated state
 * @param  {Object} [predicate={}]  [description]
 * @param  {Array|Object}  [conditions=[]] [description]
 * @return {Boolean} returns the aggregate of all of the conditionals
 */
export const createEnforcementPolicies = (predicate = {}, conditions = []) => {
  return bindState(
    makeStack(conditions),
    predicate
  )
}

export function boolPipe(previous, current){
  let prev = typeof previous === 'function' && previous;
  if(prev) {
    return function(next){
      return prev(next) && current(prev(next))
    }
  }

  return function(next){
    if(!next) {
      return false;
    }
    return current(next)
  }
}

/**
 * enforce
 * @param  {Array}  [stack=[]] [description]
 * @return {[type]}            [description]
 */
export const enforce  = (stack = []) => {
  return stack.reduceRight(boolPipe, false)
}
