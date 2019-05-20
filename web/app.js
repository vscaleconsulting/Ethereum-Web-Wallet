App = {
    provider: null,
    cancelScrypt: false,
    activeWallet: null,
    contract: null,

    setupWallet: function (wallet) {
        showWallet();
        
        // connect to local Geth
        //App.provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545");
        
        // connect to ropsten
        App.provider = ethers.getDefaultProvider('ropsten');
        App.activeWallet = wallet.connect(App.provider);
    
        var inputWalletAddress = $('#wallet-address');
        inputWalletAddress.val(wallet.address);
    
        // $('#save-keystore').click(App.exportKeystore);
    
        App.refreshUI();
        App.setupSendEther();

        App.initToken();
        App.setupSendToken();
      },


    //============================= Method for Load Wallet ==============================//  
    // Load PriKey
    initLoadKey: function() {
        var inputPrivatekey = $('#select-prikey');
        var submit = $('#submit-prikey');

        // generate prikey
        let randomNumber = ethers.utils.bigNumberify(ethers.utils.randomBytes(32));
        inputPrivatekey.val(randomNumber._hex);

        // when click "Load Private Key"
        submit.click(function() {
            if (submit.hasClass('disable')) return; 
            var privateKey = inputPrivatekey.val();
            if (privateKey.substring(0, 2) !== '0x') {
                privateKey = '0x' + privateKey;
            }
  
            App.setupWallet(new ethers.Wallet(privateKey));
        });

        inputPrivatekey.on("input", function() {
            if (inputPrivatekey.val().match(/^(0x)?[0-9A-fa-f]{64}$/)) {
                submit.removeClass('disable');
            } else {
                submit.addClass('disable');
            }
        });

    },


    // Load Memonic Phrase
    initMnemonic: function() {
        var inputPhrase = $('#select-mnemonic-phrase');
        var inputPath = $('#select-mnemonic-path');
        var submit = $('#submit-mnemonic');
    
        // generate
        let mnemonic = ethers.utils.HDNode.entropyToMnemonic(ethers.utils.randomBytes(16));
        inputPhrase.val(mnemonic);
    
        function check() {
            if (ethers.utils.HDNode.isValidMnemonic(inputPhrase.val())) {
                submit.removeClass('disable');
            } else {
                submit.addClass('disable');
            }
        }
        inputPhrase.on("input", check);
        inputPath.on("input", check);
    
        submit.click(function() {
            if (submit.hasClass('disable')) return; 
            App.setupWallet(ethers.Wallet.fromMnemonic(inputPhrase.val(), inputPath.val()));
        });
    
      },

    //============================= Method for ETH info ==============================//  
      
    refreshUI: function() {
        var inputBalance = $('#wallet-balance');
        var inputTransactionCount = $('#wallet-transaction-count');
    
        $("#wallet-submit-refresh").click(function() {
            App.addActivity('> Refreshing details...');
            // get balance include pending TXs
            App.activeWallet.getBalance('pending').then(function(balance) {
                App.addActivity('< Balance: ' + balance.toString(10));
                inputBalance.val(ethers.utils.formatEther(balance, { commify: true }));
            }, function(error) {
                console.log(error);
            });
    
            App.activeWallet.getTransactionCount('pending').then(function(transactionCount) {
                App.addActivity('< TransactionCount: ' + transactionCount);
                inputTransactionCount.val(transactionCount);
            }, function(error) {
                console.log(error);
            });
        });
    
        $("#wallet-submit-refresh").click();
    },


    setupSendEther: function() {
        var inputTargetAddress = $('#wallet-send-to-address');
        var inputAmount = $('#wallet-send-amount');
        var submit = $('#wallet-submit-send');
    
        // Validate the address and value (to enable the send button)
        function check() {
            try {
                ethers.utils.getAddress(inputTargetAddress.val());
                ethers.utils.parseEther(inputAmount.val());
            } catch (error) {
                submit.addClass('disable');
                return;
            }
            submit.removeClass('disable');
        }
        inputTargetAddress.on("input", check);
        inputAmount.on("input", check);
    
        // Send ether
        submit.click(function() {
            // get address with base transform
            var targetAddress = ethers.utils.getAddress(inputTargetAddress.val());
            /// ether -> wei
            var amountWei = ethers.utils.parseEther(inputAmount.val());
    
            App.activeWallet.sendTransaction({
                to: targetAddress,
                value: amountWei,
                gasPrice: activeWallet.provider.getGasPrice(),  // update from net
                gasLimit: 21000,
            }).then(function(tx) {
                console.log(tx);
    
                App.addActivity('< Transaction sent: ' + tx.hash.substring(0, 20) + '...');
                alert('Success!');
    
                inputTargetAddress.val('');
                inputAmount.val('');
                submit.addClass('disable');
    
                App.refreshUI();    // update the balance
            }, function(error) {
                console.log(error);
            });
        })
    },
    





    addActivity: function(message) {
        var activity = $('#wallet-activity');
        activity.append("</br>" + message);
      },
}

