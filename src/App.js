import React, { useEffect, useState } from 'react';
import twitterLogo from './assets/twitter-logo.svg';
import './App.css';

// Constants
const TWITTER_HANDLE = '_buildspace';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;
const TEST_GIFS = [
	'https://media.giphy.com/media/PnDvC2sOfqK0jqp2Hs/giphy.gif',
  'https://media.giphy.com/media/MjSVpwDw2UQuVGionY/giphy.gif',
  'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExeTZ3anY0cDcwOXc5ZmQycW1kbnRlN2JmNzZxNXNjbTZnbXV3MXJxYiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/fdn1Bw4etcmiE2Xyjg/giphy.gif',
  'https://media.giphy.com/media/dUAjksQZrimf0lhupc/giphy.gif'
]

const App = () => {
  // State
  const [walletAddress, setWalletAddress] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [gifList, setGifList] = useState([]);



  // Actions
  const checkIfWalletIsConnected = async () => {
    if (window?.solana?.isPhantom) {
      console.log('Phantom wallet found!');
      const response = await window.solana.connect({ onlyIfTrusted: true });
      console.log(
        'Connected with Public Key:',
        response.publicKey.toString()
      );

      /*
       * Set the user's publicKey in state to be used later!
       */
      setWalletAddress(response.publicKey.toString());
    } else {
      alert('Solana object not found! Get a Phantom Wallet 👻');
    }
  };

 const connectWallet = async () => {
  const { solana } = window;

  if (solana) {
    const response = await solana.connect();
    console.log('Connected with Public Key:', response.publicKey.toString());
    setWalletAddress(response.publicKey.toString());
  }
};
  const sendGif = async () => {
    if (inputValue.length > 0) {
    console.log('Gif link:', inputValue);
    setGifList([...gifList, inputValue]);
    setInputValue('');
  } else {
    console.log('Empty input. Try again.');
  }
};
  const onInputChange = (event) => {
  const { value } = event.target;
  setInputValue(value);
};

  const renderNotConnectedContainer = () => (
    <button
      className="cta-button connect-wallet-button"
      onClick={connectWallet}
    >
      Connect to Wallet
    </button>
  );

const renderConnectedContainer = () => (
    <div className="connected-container">
      <form
        onSubmit={(event) => {
          event.preventDefault();
          sendGif();
        }}
      >
        <input
          type="text"
          placeholder="Enter gif link!"
          value={inputValue}
          onChange={onInputChange}
        />
        <button type="submit" className="cta-button submit-gif-button">
          Submit
        </button>
      </form>
      <div className="gif-grid">
        {/* Map through gifList instead of TEST_GIFS */}
        {gifList.map((gif) => (
          <div className="gif-item" key={gif}>
            <img src={gif} alt={gif} />
          </div>
        ))}
      </div>
    </div>
  );
  // UseEffects
  useEffect(() => {
    const onLoad = async () => {
      await checkIfWalletIsConnected();
    };
    window.addEventListener('load', onLoad);
    return () => window.removeEventListener('load', onLoad);
  }, []);
  useEffect(() => {
  if (walletAddress) {
    console.log('Fetching GIF list...');
    
    // Call Solana program here.

    // Set state
    setGifList(TEST_GIFS);
  }
}, [walletAddress]);

return (
  <div className="App">
    <div className="container">
      <div className="header-container">
        <p className="header">🖼 GIF Portal</p>
        <p className="sub-text">
          View your GIF collection in the metaverse ✨
        </p>
        {!walletAddress && renderNotConnectedContainer()}
        {/* We just need to add the inverse here! */}
        {walletAddress && renderConnectedContainer()}
      </div>
      <div className="footer-container">
      </div>
    </div>
  </div>
);
};

export default App;