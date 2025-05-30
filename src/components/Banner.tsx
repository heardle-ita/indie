import React, { useEffect } from 'react';

const loadScriptInHead = (src: string, attributes: Record<string, string | boolean>) => {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.async = true;

    Object.entries(attributes).forEach(([key, value]) => {
      if (typeof value === 'boolean') {
        if (value) script.setAttribute(key, '');
      } else {
        script.setAttribute(key, value);
      }
    });

    script.onload = () => resolve(src);
    script.onerror = () => reject(new Error(`Failed to load ${src}`));

    document.head.appendChild(script);
  });
};

const ExternalScriptComponent = () => {
  useEffect(() => {
    loadScriptInHead('https://fpyf8.com/88/tag.min.js', {
      'data-zone': '149855',
      'data-cfasync': 'false',
      async: true,
    })
      .then(() => console.log('Script loaded into <head> successfully'))
      .catch((error) => console.error('Failed to load the script into <head>:', error));
  }, []);

  return null;
};

export default ExternalScriptComponent;
