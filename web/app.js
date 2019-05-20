App = {
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
}

