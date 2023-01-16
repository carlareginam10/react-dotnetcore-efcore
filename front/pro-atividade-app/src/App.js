import { useState, useEffect } from 'react';
import './App.css';
import AtividadeForm from './components/AtividadeForm';
import AtividadeLista from './components/AtividadeLista';
import api from './api/atividade'
import {Button, Modal} from 'react-bootstrap';

function App() {
    //modal do react-bootstrap com alterações
    const [showAtividadeModal, setShowAtividadeModal] = useState(false);
    const [smShowConfirmModal, SetSmShowConfirmModal] = useState(false);
    
    const [atividades, setAtividades] = useState([]);
    const [atividade, setAtividade] = useState({ id: 0 });

    //modal do react-bootstrap, no final da pag tem o restante do modal
    const handleAtividadeModal = () => setShowAtividadeModal(!showAtividadeModal);

    const handleConfirmModal = (id) => {
        if(id !==0 && id !== undefined){
            const atividade = atividades.filter((atividade) => atividade.id === id);
        setAtividade(atividade[0]);
        }
        else{
            SetSmShowConfirmModal({id:0})
        }
        
        SetSmShowConfirmModal(!smShowConfirmModal);
    }
    
  //o api.get vai na pasta api e pegar o arquivo atividade pra montar a url completa
  // que vai ficar   http://localhost:5000/api/atividade
  //async significa q vai ter uma chamada assincrona
  //await esperar
    const pegaTodasAtividades = async () =>
        {
        const response = await api.get('atividade');
        return response.data;
        }


    useEffect(() => {  
        const getAtividades = async () =>{
            const todasAtividades = await pegaTodasAtividades();
            if(todasAtividades) setAtividades(todasAtividades);
        };
        getAtividades();
     }, []);

    const addAtividade = async(ativ) => {
        handleAtividadeModal();
        //o post precisa de um corpo, por isso tem o
        // o ativ que é o corpo da atividade
        const response = await api.post('atividade', ativ);
        setAtividades([...atividades, response.data]);
    }
    /**
    note que as duas funções abaixo tem os mesmos parametros
    a primeira é uma arrow e a segunda é uma função clássica  
    apesar de fazerem a mesma coisa optou-se por fazer duas funções
    pois elas atendem objetivos diferentes e podem ter alterações
    específicas no futuro */   
     
    
    const novaAtividade = () =>{
        setAtividade({ id: 0 });
        handleAtividadeModal();
    }

    function cancelarAtividade() {
        setAtividade({ id: 0 });
        handleAtividadeModal();
    }

    const atualizarAtividade = async(ativ) => {
       handleAtividadeModal();
       const response = await api.put(`atividade/${ativ.id}`, ativ)
        setAtividades(
            atividades.map((item) => (item.id === ativ.id ? response.data : item))
        );
        setAtividade({ id: 0 });
       
    }

    const deletarAtividade = async (id) =>{
        handleConfirmModal(0);
       if(await api.delete(`atividade/${id}`)){
        const atividadesFiltradas =  atividades.filter(
            (atividade) => atividade.id !== id
        );
        setAtividades([...atividadesFiltradas]);
       }
       
    }

    function pegarAtividade(id) {
        const atividade = atividades.filter((atividade) => atividade.id === id);
        setAtividade(atividade[0]);
        handleAtividadeModal();
    }

    return (
        <>
            <div className='d-flex justify-content-between align-items-end mt-2 pb-3 border-bottom '>
                <h1 className='m-0 p-0' >                    
                    Atividade {atividade.id !== 0 ? atividade.id : ''}
                </h1>
                <Button variant="outline-secondary-" onClick={novaAtividade}>
                        <i className='fas fa-plus'></i>
                </Button>                
            </div>
            
            <AtividadeLista
                atividades={atividades}              
                pegarAtividade={pegarAtividade}
                handleConfirmModal={handleConfirmModal}
            />
            
            
            
            <Modal show={showAtividadeModal} onHide={handleAtividadeModal}>
                    <Modal.Header closeButton>
                    <Modal.Title>Atividade {atividade.id !== 0 ? atividade.id : ''}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <AtividadeForm
                            addAtividade={addAtividade}
                            cancelarAtividade={cancelarAtividade}
                            atualizarAtividade={atualizarAtividade}
                            ativSelecionada={atividade}
                            atividades={atividades}
                        />
                     </Modal.Body>
                                     
            </Modal> 
            <Modal 
                size='sm'
                show={smShowConfirmModal} 
                onHide={handleConfirmModal}
                >
                    <Modal.Header closeButton>
                        <Modal.Title>Excluindo Atividade{''} 
                            {atividade.id !== 0 ? atividade.id : ''}
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                       Deseja excluir a atividade {atividade.id}?
                    </Modal.Body>
                    <Modal.Footer>
                        <button 
                            className='btn btn-outline-success me-2'
                            onClick={()=>deletarAtividade(atividade.id)}>
                            <i className='fas fa-check me-2'></i>
                            Sim
                        </button>
                        <button 
                            className='btn btn-danger me-2'
                            onClick={()=>handleConfirmModal(0)}>
                            <i className='fas fa-times me-2'></i>
                            Não
                        </button>
                    </Modal.Footer>
                                     
            </Modal>     
        </>
    );
}

export default App;
