import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { cleanAndValidate, blobToBase64 } from './helpers.ts';
import axios from 'axios';
import './App.css'

function App() {
  const { UNSANITZED_COMPANY_NAME } = useParams<{ UNSANITZED_COMPANY_NAME: string }>();
  const [image, setImg] = useState<string | null>(null);
  
  useEffect(() => {
    if (!UNSANITZED_COMPANY_NAME) return;
    // ensure it's a valid and sanitzied url
    const cleanedName = cleanAndValidate(UNSANITZED_COMPANY_NAME);

    if(!cleanedName) return;

    // check the cache to prevent repeated API calls
    const cachedLogo = localStorage.getItem(cleanedName);

     if (cachedLogo) {
       // If logo is in localStorage, use it
      setImg(cachedLogo);
      return;
    }

    (async () => {
      try {
        const { data } = await axios.get("/api/getLogo", {
          params: {
            q: cleanedName
          },
          responseType: 'blob'
        });

        if(data) {
          // convert the blob so we can also store it in local cache
          const result = await blobToBase64(data);
          if (typeof result === 'string') {
            localStorage.setItem(cleanedName, result);
            setImg(result);
          }
        }

      }catch(e) {
        console.error(e);
      }
    })();

  }, [UNSANITZED_COMPANY_NAME]);

  return (
    <>
      <h1>Welcome to my full stack app!</h1>
      <div className="card">
      {image ? (
        <img src={image} alt="Logo" onError={() => setImg(null)} />
      ) : (
        <span style={{ fontSize: '5.5rem' }}>👋</span>
      )}
        <div className='card'>
          <p>I'm Andrew Aromin and I'm a Senior Full Stack Software Engineer</p>
          <p>
            I built this app using React, Node.js, Nginx, and Docker
          </p>
          <p>Check out my <a href="https://www.linkedin.com/in/andrew-aromin" target="_blank" rel="noopener noreferrer">
            Linkedin</a> | <a href="https://github.com/andrew-aromin/portfolio" target="_blank" rel="noopener noreferrer">
            Github</a>
          </p>
        </div>
      </div>
    </>
  )
}

export default App
