import React, { useState, useEffect } from 'react'
import './styles.css'
import logoImg from '../../assets/logo.svg'
import { Link, useHistory } from 'react-router-dom'
import { FiPower, FiTrash2 } from 'react-icons/fi'

import api from '../../services/api'

const Profile = _ => {

    const [incidents, setIncidents] = useState([])


    const ongId = localStorage.getItem('ongId')
    const ongName = localStorage.getItem('ongName')

    // Serve para fazer a navegação per uma função JS 
    const history = useHistory();

    //Serve para disparar uma função em um determinado momento 
    useEffect(_ => {
        api.get('profile', {
            headers: {
                Authorization: ongId,
            }
        }).then(response => {
            setIncidents(response.data) //Salvando o array de retorno no estado
        })
    }, [ongId])

    const handleDeleteIncident = async id => {

        try {
            await api.delete(`incidents/${id}`, {
                headers: {
                    Authorization: ongId,
                }
            })

            //Tirando do Array o caso com o ID relacionado
            setIncidents(incidents.filter(incident => incident.id !== id))

        } catch (error) {
            alert('Erro ao deletar caso, tente novamente. ')
        }
    }

    const handleLogout = async _ => {

        //Limpar a memória
        localStorage.clear()

        history.push('/')


    }

    return (
        <div className="profile-container">
            <header>

                <img src={logoImg} alt="Be the hero" />

                <span>Bem vinda, {ongName}</span>

                <Link className="button" to="/incident/new">Cadastrar novo caso</Link>

                <button onClick ={handleLogout} type="button">

                    <FiPower size={18} color="#E02041"></FiPower>
                </button>

            </header>

            <h1>Casos cadastrados</h1>

            <ul>
                {incidents.map(incident => (

                    <li key={incident.id}>

                        <strong>CASO:</strong>
                        <p>{incident.title}</p>

                        <strong>DESCRIÇÃO</strong>
                        <p>{incident.description}</p>

                        <strong>VALOR</strong>
                        <p>
                            {Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })
                                .format(incident.value)}
                        </p>

                        <button type="button" onClick={() => handleDeleteIncident(incident.id)}>
                            <FiTrash2 size={20} color="#a8a8b3" />

                        </button>
                    </li>
                ))}
            </ul>
        </div>

    )
}


export default Profile;