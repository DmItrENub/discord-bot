//npm install node-qiwi-api
var callbackQiwi = require('node-qiwi-api').callbackApi;
var asyncQiwi = require('node-qiwi-api').asyncApi;
const token = "80da3b7568d6c5d15043812d55d1659e"
var wallet = new callbackQiwi(token);
var asyncWallet = new asyncQiwi(token);

function sleep(timeout) {
    let now = new Date()
    while (now+timeout <= new Date()) {
        continue
    }
    return;
}

async function getMoney(comment) {
    wallet.getOperationHistory(79200000085, {rows:25, operation:"IN", sources:["QW_USD"]}, (err, operations) => {
        if (err) {
            throw "Error"
        }
        for (let i = 0; i < 5; i++) {
            for (let i = 0; i < 25; i++) {
                if (operations[i].comment == comment) {
                    return true
                } else {
                    continue
                }
            }
            sleep(30000)
        }
        return false
    });
}