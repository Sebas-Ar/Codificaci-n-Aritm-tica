import React, { useState, useEffect } from 'react'
import { Element, scroller } from 'react-scroll';
import Head from 'next/head'
import Footer from '../components/Footer'
import Swal from 'sweetalert2'

const setupScroll = {
    duration: 3000,
    delay: 50,
    smooth: true, // linear “easeInQuint” “easeOutCubic”,
    offset: -10
}

const Home = () => {

    const [numSimbolos, setNumSimbolos] = useState(0);
    const [mensaje, setMensaje] = useState([])
    const [nummensaje, setNumMensaje] = useState(0);
    const [simbolos, setSimbolos] = useState([]);
    const [validateFirst, setValidateFirst] = useState(false)
    const [validateSecond, setValidateSecond] = useState(false);
    const [validateThird, setValidateThird] = useState(false);
    const [value, setValue] = useState([]);
    const [decodificacion, setDecodificacion] = useState([]);

    useEffect(() => {
        let vector = []
        for (let i = 0; i < numSimbolos; i++) {
            if (simbolos[i]) {
                vector[i] = {
                    i,
                    simbolo: simbolos[i].simbolo ? simbolos[i].simbolo : undefined,
                    probabilidad: simbolos[i].probabilidad ? simbolos[i].probabilidad : 0
                }
            } else {
                vector[i] = { i }
            }
        }
        setSimbolos(vector)
    }, [numSimbolos])

    useEffect(() => {
        let msg = []

        for (let i = 0; i < nummensaje; i++) {
            if (mensaje[i]) {
                msg[i] = {
                    i,
                    simbolo: mensaje[i].simbolo ? mensaje[i].simbolo : undefined
                }
            } else {
                msg[i] = { i }
            }
        }

        setMensaje(msg)

    }, [nummensaje])

    useEffect(() => {

        let sumaSimbolos = 0
        let sumaProbabilida = 0

        for (let sim of simbolos) {

            sim.simbolo ? sumaSimbolos += 1 : null
            sim.probabilidad ? sumaSimbolos += 1 : null
            sumaProbabilida += sim.probabilidad

        }

        if (sumaSimbolos / 2 === numSimbolos && numSimbolos !== 0) {
            if (sumaProbabilida === 1) {
                setValidateFirst(true)
            } else {
                Swal.fire({
                    position: 'center',
                    icon: 'warning',
                    title: 'Oops...',
                    text: 'La sumatoria de probabilidades debe ser igual a 1',
                    showConfirmButton: false,
                    timer: 2000
                })
            }
        } else {
            setValidateFirst(false)
        }

    }, [simbolos])

    useEffect(() => {

        let sumaSimbolos = 0
        let validate = true
        let validateNull = true

        for (const msg of mensaje) {
            msg.simbolo ? sumaSimbolos += 1 : null
        }

        for (const sim of simbolos) {
            let suma = 0
            for (const msg of mensaje) {
                if (msg.simbolo !== 'nulo') {
                    sim.simbolo === msg.simbolo ? suma += 1 : null
                } else {
                    validate = false
                    validateNull = false
                }
            }
            if (suma === 0) {
                validate = false
            }
        }

        if (sumaSimbolos === nummensaje && nummensaje !== 0) {
            if (validate) {
                setValidateSecond(true)
                scroller.scrollTo("info", setupScroll)
            } else {
                if (validateNull) {
                    Swal.fire({
                        position: 'center',
                        icon: 'warning',
                        title: 'Oops...',
                        text: 'El mensaje debe contener todos los simbolos',
                        showConfirmButton: false,
                        timer: 2000
                    })
                    setValidateSecond(false)
                } else {
                    setValidateSecond(false)
                }
            }
        }

    }, [mensaje]);

    const onChange = (e) => {
        if (parseInt(e.target.value) < 0) {
            setNumSimbolos(parseInt(0))
            e.target.value = 0
        } else {
            setNumSimbolos(parseInt(e.target.value))
        }
    }

    const onChangeNumMensaje = (e) => {
        let sumaProbabilidades = 0
        let simbolosAB = []
        for (let i = 0; i < simbolos.length; i++) {
            simbolosAB[i] = simbolos[i];
        }

        for (const sim of simbolosAB) {
            sim.a = sumaProbabilidades
            sim.b = sim.probabilidad + sumaProbabilidades
            sumaProbabilidades += sim.probabilidad
        }

        if (parseInt(e.target.value) < 0) {
            setNumMensaje(parseInt(0))
            e.target.value = 0
        } else {
            setNumMensaje(parseInt(e.target.value))
        }
        
    }

    const onChangeMensaje = (e, pos) => {

        let msg = []
        for (let i = 0; i < mensaje.length; i++) {
            msg[i] = mensaje[i];
        }
        msg[pos] = Object.assign({}, msg[pos], { [e.target.name]: e.target.value })
        setMensaje(msg)

    }

    const onChangeSimbol = (e, sim) => {

        let arreglo = []
        for (let i = 0; i < simbolos.length; i++) {
            arreglo[i] = simbolos[i];
        }

        if (e.target.value.length < 2) {
            arreglo[sim] = Object.assign({}, arreglo[sim], { [e.target.name]: e.target.value })
            for (let simbol1 of arreglo) {
                let suma = 0
                for (let simbol2 of arreglo) {
                    if (simbol1.simbolo !== undefined && simbol2.simbolo !== undefined) {
                        if (simbol1.simbolo === simbol2.simbolo) suma += 1
                    }
                }
                if (suma > 1) {
                    Swal.fire({
                        position: 'center',
                        icon: 'warning',
                        title: 'Oops...',
                        text: 'el simbolo ya existe',
                        showConfirmButton: false,
                        timer: 2000
                    })
                    arreglo[sim] = Object.assign({}, arreglo[sim], { [e.target.name]: null })
                    e.target.value = ''
                }
            }
        } else {
            Swal.fire({
                position: 'center',
                icon: 'warning',
                title: 'Oops...',
                text: 'Solo puedes ingresar un simbolo',
                showConfirmButton: false,
                timer: 2000
            })
            arreglo[sim] = Object.assign({}, arreglo[sim], { [e.target.name]: null })
            e.target.value = ''
        }
        setSimbolos(arreglo)
    }

    const onChangeProbabilidad = (e, sim) => {

        let arreglo = []
        for (let i = 0; i < simbolos.length; i++) {
            arreglo[i] = simbolos[i];
        }

        let suma = 0
        let value = parseFloat(e.target.value)

        if (isNaN(value)) {
            value = 0;
        }

        if (value >= 0) {

            arreglo[sim] = Object.assign({}, arreglo[sim], { [e.target.name]: value })

        } else {

            Swal.fire({
                position: 'center',
                icon: 'warning',
                title: 'Oops...',
                text: 'No puedes ingresar numero negativos',
                showConfirmButton: false,
                timer: 2000
            })
            arreglo[sim] = Object.assign({}, arreglo[sim], { [e.target.name]: 0 })
            e.target.value = 0

        }


        for (let simbol1 of arreglo) {
            if (simbol1.probabilidad) {
                suma += simbol1.probabilidad
            }
        }

        if (suma > 1) {
            Swal.fire({
                position: 'center',
                icon: 'warning',
                title: 'Oops...',
                text: 'La suma de las probabilidades no puede ser mayor a 1',
                showConfirmButton: false,
                timer: 2000
            })
            arreglo[sim] = Object.assign({}, arreglo[sim], { [e.target.name]: 0 })
            e.target.value = 0
        }

        setSimbolos(arreglo)
    }

    const codificar = () => {

        let a = 0
        let b = 1
        let newA = 0
        let newMensage = []

        for (let i = 0; i < mensaje.length; i++) {
            newMensage[i] = mensaje[i];

        }

        for (const msg of newMensage) {
            for (const sim of simbolos) {
                if (msg.simbolo === sim.simbolo) {
                    msg.a = sim.a
                    msg.b = sim.b
                }
            }
        }

        setMensaje(newMensage)

        for (const msg of mensaje) {
            newA = a
            a = a + ((b - a) * msg.a)
            b = newA + ((b - newA) * msg.b)
            newA = a
        }

        setValue([a.toFixed(7), b.toFixed(7)])
    }

    const decodificar = () => {

        let deco = []
        let valor = value[0]
        let a = 0
        let b = 1
        let simboloEncontrado = ''

        for (let i = 0; i < mensaje.length + 1; i++) {
            valor = (valor - a) / (b - a)
            for (const sim of simbolos) {
                if (valor.toFixed(7) >= sim.a && valor.toFixed(7) < sim.b) {
                    a = sim.a
                    b = sim.b
                    simboloEncontrado = sim.simbolo
                }
            }
            if (i !== mensaje.length) {
                deco[i] = {
                    valor: valor.toFixed(7),
                    rango: `[${a.toFixed(2)},${b.toFixed(2)})`,
                    simbolo: simboloEncontrado
                }
            } else {
                deco[i] = {
                    valor: 0,
                    rango: `FIN`
                }
            }
        }

        setValidateThird(true)
        setDecodificacion(deco)

    }

    return (
        <div className="container">

            <Head>
                <title>Codificación Aritmética</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <h1>CODIFICACIÓN ARITMÉTICA</h1>

            <div className="content">

                <main>
                    <label className="completo">
                        <p className="weight">Ingrese el número de simbolos a utilizar:</p>
                        <input type="number" name="numSimbolos" value={numSimbolos} onChange={onChange} />
                    </label>
                    {

                        simbolos.map(simbolo => (
                            <label key={simbolo.i} className="completo">
                                <p className="simbol">Escriba el simbolo {simbolo.i + 1} y su probabilidad:</p>
                                <div>
                                    <input
                                        className="simbolInput"
                                        type="text"
                                        name="simbolo"
                                        onChange={(e) => { onChangeSimbol(e, simbolo.i) }}
                                    />
                                    <span>→</span>
                                    <input
                                        className="simbolInputP"
                                        type="number"
                                        name="probabilidad"
                                        onChange={(e) => { onChangeProbabilidad(e, simbolo.i) }}
                                    />
                                </div>
                            </label>
                        ))

                    }
                </main>

                {
                    validateFirst
                        ?
                        <main>
                            <label className="completo">
                                <p className="weight">Ingrese cuantos simbolos va a usar en el mensaje</p>
                                <input type="number" name="numSimbolos" value={nummensaje} onChange={onChangeNumMensaje} />
                            </label>

                            {
                                mensaje.map(msg => (
                                    <label key={msg.i}>
                                        <p className="simbol">Elija el simbolo {msg.i + 1}</p>
                                        <select defaultValue="nulo" name="simbolo" onChange={(e) => { onChangeMensaje(e, msg.i) }}>
                                            <option value="nulo">-</option>
                                            {
                                                simbolos.map(sim => (
                                                    <option key={sim.i} value={sim.simbolo}>{sim.simbolo}</option>
                                                ))
                                            }
                                        </select>
                                    </label>
                                ))
                            }
                        </main>
                        :
                        null
                }

                {
                    validateFirst && validateSecond
                    ?
                        <main className="completo" name="info">
                        <div className="completo top">
                            {
                                simbolos.map(sim => (
                                    <span><span className="weight">{sim.simbolo}</span>→ [{sim.a || sim.a === 0 ? sim.a.toFixed(2) : ''},{sim.b ? sim.b.toFixed(2) : ''})</span>
                                ))
                            }
                        </div>
                        <br />
                            <div className="grafica completo">
                                <div className="linea">
                                    {
                                        simbolos.map(sim => (
                                            <span className="numero" style={{ left: `${sim.a * 300}px`, margin: '0' }}>{sim.a.toFixed(2)}</span>
                                        ))
                                    }
                                    {
                                        simbolos.map(sim => (
                                            <div className="punto" style={{left: `${sim.a*300}px`}}></div>
                                        ))
                                    }
                                    {
                                        simbolos.map(sim => (
                                            <span className="letra weight" style={{ left: `${sim.b * 150 + sim.a * 150}px`, margin: '0'}}>{sim.simbolo}</span>
                                        ))
                                    }
                                    <div className="punto" style={{left: '300px'}}></div>
                                    <span className="numero" style={{ left: '300px', margin: '0' }}>1</span>
                                </div>
                            </div>
                        <br />
                        <button className="completo" onClick={codificar}>Codificar</button>

                    </main>
                    :
                    null

                }

                {
                    value[0] && value[1] && validateFirst && validateSecond
                    ?
                    <main>
                        <p className="completo weight">El valor a codificar es:</p>
                        <p className="completo size">[{value[0]},{value[1]})</p>
                        <button className="completo" onClick={decodificar}>Decodificar</button>
                    </main>
                    :
                    null
                }

                {
                    validateThird && value[0] && value[1] && validateFirst && validateSecond
                    ?
                    <main>
                            <p className="completo weight">La decodificacion es:</p>
                        {
                            decodificacion.map(deco => (
                                <div className="completo final">
                                    <p>{deco.valor}</p>
                                    <span>→</span>
                                    <p>{deco.rango}</p>
                                    <span>{deco.valor ? '→' : null}</span>
                                    <p>{deco.simbolo ? deco.simbolo : null}</p>
                                </div>
                            ))
                        }
                    </main>
                    :
                    null
                }

            </div>

            <Footer />

            <style jsx>{`

                .grafica {
                    margin-top: 32px;
                }

                .letra {
                    position: absolute;
                    top: -20px;
                    transform: translateX(-50%);
                }

                .top {
                    margin-top: 16px;
                }

                .numero {
                    position: absolute;
                    top: -35px;
                    transform: translateX(-45%);
                }

                .linea {
                    width: 300px;
                    height: 3px;
                    background: white;
                    position: relative;
                }

                .punto {
                    position: absolute;
                    top: -10px;
                    width: 3px;
                    height: 23px;
                    background: white;
                }

                h1 {
                    color: white;
                    text-align: center;
                }

                .simbol {
                    font-size: 12px;
                }

                .weight {
                    font-weight: 600;
                }

                .size {
                    font-size: 25px;
                }

                .content {
                    display: grid; 
                    grid-template-columns: ${validateFirst ? '1fr 1fr' : '1fr'};
                }

                .container {
                    min-height: 100vh;
                    padding: 0 0.5rem;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                }

                span {
                    color: white;
                    margin: 0 5px;
                }

                label {
                    display: grid;
                    justify-items: center;
                }

                input, select {
                    height: 30px;
                    border-radius: 20px;
                    border: 1px solid #33333344;
                    padding: 10px;
                    outline: none;
                    text-align: center;
                }

                select {
                    padding: 0px 10px;
                }

                .simbolInput {
                    width: 50px;
                    margin: 0 5px;
                }

                .simbolInputP {
                    width: 70px;
                    margin: 0 5px;
                }

                .completo {
                    grid-column: 1/3
                }

                .completo2 {
                    grid-column: 1/4
                }

                .final {
                    display: grid;
                    grid-template-columns: 1fr 30px 1fr 30px .5fr;
                    align-items: center;
                    justify-items: center;
                }

                main {
                    padding: 5rem 0;
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    align-items: center;
                    justify-items: center;
                    border-radius: 30px;
                    margin: 10px;
                    padding: 30px;
                    background: #2C3E5044;
                }

                :globla(body) {
                    background: linear-gradient(180deg, #F3904F 0%, #3B4371 100%);
                }

                p {
                    color: white;
                }

                button {
                    border: none;
                    padding: 10px 30px;
                    border-radius: 30px;
                    background-color: #528B90;
                    color: white;
                    cursor: pointer;
                    transition: background-color 1s;
                    outline: none;
                    margin: 16px 0;
                }

                button:hover {
                    background-color: #51A8A7;
                }

            `}</style>

            <style jsx global>{`

                html, body {
                    padding: 0;
                    margin: 0;
                    font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen,
                    Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
                }

                * {
                    box-sizing: border-box;
                }

            `}</style>

        </div>
    )
}

export default Home