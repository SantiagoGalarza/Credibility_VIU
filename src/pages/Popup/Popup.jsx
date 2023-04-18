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
  const [esTuit, setEsTuit] = React.useState(false);
  const [usuario, setUsuario] = React.useState('');
  const [id, setId] = React.useState('');
  const [error, setError] = useState(false);
  const [isLoading, setLoading] = useState(true);
  const [datosCredebility, setDatosCredebility] = useState(null);
  const [datosbyId, setDatosById] = useState(null);
  const [home, setHome] = useState(false);

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
      `http://localhost:8080/calculate/twitter/tweets?weightBadWords=0.33&weightMisspelling=0.23&weightSpam=0.44&weightText=0.34&maxFollowers=2000000&weightUser=0.33&weightSocial=0.33&weightHistoric=0&tweetId=${OnlyIds[0]}&usuario=${usuario}&guardar=true`
    ).then((response) => response.json());
    const promise2 = fetch(
      `http://localhost:8080/calculate/twitter/tweets?weightBadWords=0.33&weightMisspelling=0.23&weightSpam=0.44&weightText=0.34&maxFollowers=2000000&weightUser=0.33&weightSocial=0.33&weightHistoric=0&tweetId=${OnlyIds[1]}&usuario=${usuario}&guardar=true`
    ).then((response) => response.json());
    const promise3 = fetch(
      `http://localhost:8080/calculate/twitter/tweets?weightBadWords=0.33&weightMisspelling=0.23&weightSpam=0.44&weightText=0.34&maxFollowers=2000000&weightUser=0.33&weightSocial=0.33&weightHistoric=0&tweetId=${OnlyIds[2]}&usuario=${usuario}&guardar=true`
    ).then((response) => response.json());
    const promesaCredibilidadUsuario = fetch(
      `http://localhost:8080/calculate/twitter/user/${usuario}`
    ).then((response) => response.json());
    const promesaCredibilidadSocial = fetch(
      `http://localhost:8080/calculate/twitter/social/${usuario}?maxFollowers=2000000`
    ).then((response) => response.json());
    const promesaCredibilidadHistorica = fetch(
      `http://localhost:8080/calculate/twitter/historical/${usuario}`
    ).then((response) => response.json());
    const promisenew1 = fetch(
      `http://localhost:8080/calculate/twitter/tweets?weightBadWords=0.33&weightMisspelling=0.23&weightSpam=0.44&weightText=0.25&maxFollowers=2000000&weightUser=0.25&weightSocial=0.25&weightHistoric=0.25&tweetId=${OnlyIds[0]}&guardar=false`
    ).then((response) => response.json());
    const promisenew2 = fetch(
      `http://localhost:8080/calculate/twitter/tweets?weightBadWords=0.33&weightMisspelling=0.23&weightSpam=0.44&weightText=0.25&maxFollowers=2000000&weightUser=0.25&weightSocial=0.25&weightHistoric=0.25&tweetId=${OnlyIds[1]}&guardar=false`
    ).then((response) => response.json());
    const promisenew3 = fetch(
      `http://localhost:8080/calculate/twitter/tweets?weightBadWords=0.33&weightMisspelling=0.23&weightSpam=0.44&weightText=0.25&maxFollowers=2000000&weightUser=0.25&weightSocial=0.25&weightHistoric=0.25&tweetId=${OnlyIds[2]}&guardar=false`
    ).then((response) => response.json());

    // Usamos Promise.all para esperar a que se completen las promesas
    Promise.all([
      promise1,
      promise2,
      promise3,
      promesaCredibilidadUsuario,
      promesaCredibilidadSocial,
      promesaCredibilidadHistorica,
      promisenew1,
      promisenew2,
      promisenew3,
    ])
      .then((users) => {
        setDatosCredebility(users);
        setCredibilidadUsuario(users[5]);
        // Los resultados de las tres promesas se pasan como un array de objetos
        console.log(users[0]); // información del usuario 1
        console.log(users[1]); // información del usuario 2
        console.log(users[2]); // información del usuario 3
        console.log(users[3]); // credibilidad de usuario
        console.log(users[4]); // credibilidad de social
        console.log(users[5]); // credibilidad historica
        console.log(users[6]); // nueva credibilidad del usuario 1
        console.log(users[7]); // nueva credibilidad del usuario 2
        console.log(users[8]); // nueva credibilidad del usuario 3
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

  const getNames = async () => {
    const regex = /https:\/\/twitter.com\//;
    const regex2 = /https:\/\/twitter.com\/[a-zA-Z0-9_]+\/status\/[0-9]+/g;
    chrome.tabs.query(
      {
        active: true,
        lastFocusedWindow: true,
      },
      function (tabs) {
        // and use that tab to fill in out title and url

        var tab = tabs[0];
        const tabUrl = tab.url;
        if (tabUrl.includes('https://twitter.com/home')) {
          alert('Por favor ingrese a un nombre de usuario de twitter');
        }
      }
    );
    chrome.tabs.query(
      {
        active: true,
        lastFocusedWindow: true,
      },
      function (tabs) {
        // and use that tab to fill in out title and url

        var tab = tabs[0];
        const tabUrl = tab.url;
        if (tabUrl.match(regex) && !tabUrl.match(regex2)) {
          const arr = tabUrl.split('/');
          // alert(arr)
          const usuario = arr[arr.length - 1];
          // alert(usuario)
          setUsuario(usuario);
          setEsTwitter(true);
          setEsTuit(false);
        }
      }
    );
    chrome.tabs.query(
      {
        active: true,
        lastFocusedWindow: true,
      },
      function (tabs) {
        // and use that tab to fill in out title and url

        var tab = tabs[0];
        const tabUrl = tab.url;
        if (tabUrl.match(regex2)) {
          const arr = tabUrl.split('/');
          const id = arr[arr.length - 1];
          // alert(id)
          setId(id);
          setEsTwitter(false);
          setEsTuit(true);
        }
      }
    );

    setEsTwitter(false);
    setEsTuit(false);
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
    } catch (error) {
      console.log('error', error);
      setError(true);
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    }
  };
  const fetchDataTuit = async () => {
    const promise1 = fetch(
      `http://localhost:8080/calculate/twitter/tweets?weightBadWords=0.33&weightMisspelling=0.23&weightSpam=0.44&weightText=0.25&maxFollowers=2000000&weightUser=0.25&weightSocial=0.25&weightHistoric=0.25&tweetId=${id}&usuario=${usuario}&guardar=false`
    ).then((response) => response.json());

    Promise.all([promise1])
      .then((users) => {
        // Los resultados de las tres promesas se pasan como un array de objetos
        /*   console.log(users[0]); // información del usuario 1
        alert(users[0]); */
        setDatosById(users[0]);
      })
      .catch((error) => console.error(error));
    /*     try {
      const response = await fetch(
        ``
      );
      
      if (!response.ok) {
        throw new Error('Response is not ok');
      }
      const newData = await response.json();
      alert('newData', newData);
      setDatosById(newData);
    } catch (error) {
      console.log('error', error);
      setError(true);
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    } */
  };

  useEffect(() => {
    getNames();
    if (esTwitter === true) {
      setTimeout(() => {
        fetchData();
      }, 1000);
    }
    if (esTuit === true) {
      setTimeout(() => {
        fetchDataTuit();
      }, 1000);
    }
  }, [usuario, id]);

  const textCredibilityComponent = (
    <Box
      component="form"
      noValidate
      autoComplete="off"
      onSubmit={onSubmitHandler}
      sx={{
        display: 'flex',
        flexDirection: 'column',
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
        <select id="lang" name="lang" onChange={(e) => inputChangeHandler(e)}>
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
              Credibilidad de usuario:{' '}
              <b style={{ color: 'green' }}>
                {datosCredebility &&
                  Number(datosCredebility[3].credibility).toFixed(2)}
                %
              </b>
            </Typography>
            <Typography variant="caption" component="div">
              Credibilidad Social:{' '}
              <b style={{ color: 'green' }}>
                {datosCredebility &&
                  Number(datosCredebility[4].credibility).toFixed(2)}
                %
              </b>
            </Typography>
            <Typography variant="caption" component="div">
              Credibilidad Histórica:{' '}
              <b style={{ color: 'red' }}>
                {datosCredebility &&
                  Number(datosCredebility[5].credibility).toFixed(2)}
                %
              </b>
            </Typography>
          </Box>
          {datosTwitter &&
            datosTwitter.map(
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
                      Nueva Credibilidad:{' '}
                      <b style={{ color: 'red' }}>
                        {datosCredebility &&
                          Number(
                            datosCredebility[index + 6].credibility
                          ).toFixed(2)}{' '}
                        %
                      </b>
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

  const tuitComponent = (
    <>
      <Typography variant="h3" component="div">
        Credibilidad:
        <b style={{ color: 'green' }}>
          {datosbyId && Number(datosbyId.credibility).toFixed(2)} %
        </b>
      </Typography>
    </>
  );

  return (
    <div className="App">
      <header className="App-header">
        <h4 className="App-title">T-CREO</h4>
        <h4 className="App-title">Credibilidad</h4>
      </header>

      {!esTwitter && !esTuit && textCredibilityComponent}
      {esTwitter && !esTuit && twitterCredibilityComponent}
      {!esTwitter && esTuit && tuitComponent}
    </div>
  );
};

export default Popup;
