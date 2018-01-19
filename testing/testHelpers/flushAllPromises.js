const flushAllPromises = () => new Promise(resolve => setImmediate(resolve))
export default flushAllPromises
