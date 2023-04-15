import React, { useEffect, useState } from 'react';
import logo from '../../assets/img/logo.svg';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import './Popup.css';
import { Typography, TextField } from '@mui/material';
import moment from 'moment';

const Popup = () => {
  const [data, setData] = React.useState('');
  const [datosTwitter, setDatosTwitter] = React.useState(null);
  const [credibilidadUsuario, setCredibilidadUsuario] = React.useState(null);

  const [esTwitter, setEsTwitter] = React.useState(false);
  const [usuario, setUsuario] = React.useState('');
  const [error, setError] = useState(false);
  const [isLoading, setLoading] = useState(true);
  const [datosCredebility, setDatosCredebility] = useState(null);
  console.log('datosTwitter datosTwitter datosTwitter', datosTwitter);

  const formData = {
    text: '',
    lang: 'es',
    weightBadWords: '0.33',
    weightMisspelling: '0.23',
    weightSpam: '0.44',
  };
  const [responseBody, setResponseBody] = useState(formData);

  const inputChangeHandler = (event) => {
    const { name, value } = event.target;
    setResponseBody({ ...responseBody, [name]: value });
  };
  const onSubmitHandler = async (event) => {
    event.preventDefault();
    console.log(responseBody);
    let response = await fetch(
      `http://localhost:8080/calculate/plain-text?weightBadWords=${responseBody.weightBadWords}&weightMisspelling=${responseBody.weightMisspelling}&weightSpam=${responseBody.weightSpam}&text=${responseBody.text}&lang=${responseBody.lang}`
    );
    console.log('response', response);
    let datos = await response.json();

    setData(datos);
    console.log(data);
  };

  const onSubmitHandlerApi = async (event) => {
    event.preventDefault();

    let OnlyIds = datosTwitter.map((item) => item.id_str);
/*     let OnlyIdUsuario = datosTwitter.map((item) => item.id_usuario);
    console.log('OnlyIdUsuario', OnlyIdUsuario); */

    const promise1 = fetch(
      `http:localhost:8080/calculate/twitter/tweets?weightBadWords=0.33&weightMisspelling=0.23&weightSpam=0.44&weightText=1&maxFollowers=2000000&weightUser=0&weightSocial=0&tweetId=${OnlyIds[0]}&usuario=${usuario}`
    ).then((response) => response.json());
    const promise2 = fetch(
      `http:localhost:8080/calculate/twitter/tweets?weightBadWords=0.33&weightMisspelling=0.23&weightSpam=0.44&weightText=1&maxFollowers=2000000&weightUser=0&weightSocial=0&tweetId=${OnlyIds[1]}&usuario=${usuario}`
    ).then((response) => response.json());
    const promise3 = fetch(
      `http:localhost:8080/calculate/twitter/tweets?weightBadWords=0.33&weightMisspelling=0.23&weightSpam=0.44&weightText=1&maxFollowers=2000000&weightUser=0&weightSocial=0&tweetId=${OnlyIds[2]}&usuario=${usuario}`
    ).then((response) => response.json());
    const promesaCredibilidadUsuario = fetch(
      `http://localhost:8080/calculate/twitter/user/${usuario}`
    ).then((response) => response.json());
    const promesaCredibilidadSocial = fetch(
      `http://localhost:8080/calculate/twitter/social/${usuario}`
    ).then((response) => response.json());

    // Usamos Promise.all para esperar a que se completen las tres promesas
    Promise.all([promise1, promise2, promise3, promesaCredibilidadUsuario, promesaCredibilidadSocial])
      .then((users) => {
        setDatosCredebility(users);
        setCredibilidadUsuario(users[3])
        // Los resultados de las tres promesas se pasan como un array de objetos
        console.log(users[0]); // información del usuario 1
        console.log(users[1]); // información del usuario 2
        console.log(users[2]); // información del usuario 3
        console.log(users[3]); // información del usuario 3
      })
      .catch((error) => console.error(error));

    /* let response = await fetch(
      `http://localhost:8080/calculate/plain-text?weightBadWords=${responseBody.weightBadWords}&weightMisspelling=${responseBody.weightMisspelling}&weightSpam=${responseBody.weightSpam}&text=${responseBody.text}&lang=${responseBody.lang}`
    );
    console.log('response', response);
    let datos = await response.json();

    setData(datos);
    console.log(data); */
  };

  const getId = async () => {
    chrome.tabs.query(
      {
        active: true,
        lastFocusedWindow: true,
      },
      function (tabs) {
        // and use that tab to fill in out title and url
        var tab = tabs[0];
        const tabUrl = tab.url;
        // console.log(tab.url);
        // alert(tab.url);
        if (tabUrl.includes('https://twitter.com')) {
          // alert('es twitter');
          const arr = tabUrl.split('/');
          const usuario = arr[arr.length - 1];
          setUsuario(usuario);
          setEsTwitter(true);
          // NOTA: llamamiento a la API para traer 3 tweets del usuario
        }
      }
    );
  };
  const fetchData = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/calculate/twitter/username/${usuario}`
      );
      if (!response.ok) {
        throw new Error('Response is not ok');
      }
      const newData = await response.json();
      console.log('newData', newData);
      setDatosTwitter(newData);
      setIdUsuario(newData.usuario_id);
    } catch (error) {
      console.log('error', error);
      setError(true);
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    }
  };

  useEffect(() => {
    getId();
    if (esTwitter) {
      setTimeout(() => {
        fetchData();
      }, 1000);  
    }
  }, [usuario, esTwitter]);

  const textCredibilityComponent = (
    <Box
      component="form"
      noValidate
      autoComplete="off"
      onSubmit={onSubmitHandler}
      sx={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'top',
        justifyContent: 'space-between',
        bgcolor: 'background.paper',
        borderRadius: 'borderRadius',
        boxShadow: 1,
        p: 1,
        width: 'auto',
        height: 'auto',
      }}
    >
      <Box sx={{ p: 1, bgcolor: 'grey.300' }}>
        <Typography variant="body1" component="div" gutterBottom>
          Texto a analizar
        </Typography>
        <textarea
          id="text"
          className="form-control"
          name="text"
          rows="2"
          cols="30"
          form="usrform"
          onChange={(e) => inputChangeHandler(e)}
          placeholder="Ingrese el texto de desea analizar"
        />
      </Box>
      <Box sx={{ p: 1, bgcolor: 'grey.300' }}>
        <Typography variant="body1" component="div" gutterBottom>
          Lenguaje
        </Typography>
        <select id="language">
          <option value="es" defaultValue>
            ES
          </option>
          <option value="en">EN</option>
          <option value="fr">FR</option>
        </select>
      </Box>
      <Typography variant="h6" component="div">
        Credibilidad de Texto {data && Number(data.credibility).toFixed(2)} %
      </Typography>
      <Button variant="contained" onClick={onSubmitHandler} fullWidth>
        Verificar
      </Button>
    </Box>
  );

  const twitterCredibilityComponent = (
    <Box sx={{ p: 1, bgcolor: 'grey.300' }}>
      <Typography variant="body1">
        Actualmente se encuentra en <b>Twitter</b>
      </Typography>
      {isLoading ? (
        <div className="spinner">
          <span>Cargando Tweets...</span>
        </div>
      ) : (
        <Box>
          <Typography variant="body1">
            Credibilidad del usuario <b>{usuario}</b>
          </Typography>
          <Box display="flex" flexDirection="column" alignItems="flex-start">
            <Typography variant="caption" component="div">
              Credibilidad de usuario: <b style={{ color: 'green' }}>
                      {datosCredebility &&
                        Number(datosCredebility[3].credibility).toFixed(
                          2
                        )}
                      %
                    </b>
            </Typography>
            <Typography variant="caption" component="div">
              Credibilidad Social:
            </Typography>
            <Typography variant="caption" component="div">
              Credibilidad Histórica:
            </Typography>
          </Box>
          {datosTwitter.map(
            ({ id_str, full_text, created_at, lang }, index) => (
              <Box
                display="flex"
                flexDirection=""
                
                alignItems="center"
                textAlign="center"
                alignContent="center"
              >
                <Box
                  display="flex"
                  flexDirection="column"
                  alignItems="flex-start"
                  component="form"
                  noValidate
                  autoComplete="off"
                  style={{ width: '100%', marginBottom: '10px' }}
                  onsSubmit={onSubmitHandlerApi}
                >
                  <Typography
                    gutterBottom
                    variant="subtitle2"
                    component="div"
                    key={id_str}
                    style={{ fontWeight: 'bold' }}
                  >
                    Tweet # {index + 1} creado el{' '}
                    {moment(created_at).format('YYYY-MM-DD HH:mm')}
                  </Typography>
                  <TextField
                    id={id_str}
                    label="Tweet"
                    variant="filled"
                    fullWidth
                    multiline
                    rows={4}
                    defaultValue={full_text}
                    inputProps={{
                      style: { fontSize: 11 },
                      readOnly: true,
                    }}
                  />
                </Box>

                <Box
                  display="flex"
                  flexDirection="column"
                  justifyContent="space-between"
                  alignItems="center"
                  textAlign="center"
                  alignContent="center"
                >
                  <Typography variant="caption" component="div">
                    Lenguaje: ES
                  </Typography>

                  <Typography variant="caption" component="div">
                    Credibilidad:{' '}
                    <b style={{ color: 'green' }}>
                      {datosCredebility &&
                        Number(datosCredebility[index].credibility).toFixed(
                          2
                        )}{' '}
                      %
                    </b>
                  </Typography>

                  <Typography variant="caption" component="div">
                    Nueva Credibilidad: 96%
                  </Typography>
                </Box>
              </Box>
            )
          )}
        </Box>
      )}
      <Button variant="contained" onClick={onSubmitHandlerApi} fullWidth>
        Verificar con Twitter API
      </Button>
    </Box>
  );

  return (
    <div className="App">
      <header className="App-header">
        <h4 className="App-title">T-CREO</h4>
        <h4 className="App-title">Credibilidad</h4>
      </header>
      {!esTwitter && textCredibilityComponent}
      {esTwitter && twitterCredibilityComponent}
    </div>
  );
};

export default Popup;
