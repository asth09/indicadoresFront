import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCedisByNameRequest } from '../api/cedis';
import { Save, X, Plus, Trash2, Edit3, AlertTriangle, CheckCircle } from 'lucide-react';

const DetalleMerida = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [editMode, setEditMode] = useState(false);
    const [cedi, setCedi] = useState(null);

    useEffect(() => {
    const fetchCedi = async () => {
        try {
            // Llamamos a la función universal pasando el parámetro
            const res = await getCedisByNameRequest('merida'); 
            
            setCedi(res.data);
            setLoading(false);
        } catch (error) {
            console.error("Error al cargar el CEDI", error);
            setLoading(false);
        }
    };
    fetchCedi();
}, []);

    // Manejar cambios en inputs simples
    const handleChange = (e, section, field) => {
        if (section) {
            setCedi({
                ...cedi,
                [section]: { ...cedi[section], [field]: e.target.value }
            });
        } else {
            setCedi({ ...cedi, [field]: e.target.value });
        }
    };

    // Manejar cambios en arreglos (Delegados/Patronos)
    const handleArrayChange = (index, field, value, arrayName) => {
        const newArray = [...cedi[arrayName]];
        newArray[index][field] = value;
        
        // Lógica automática: Si cambia fechaEleccion, calcular vencimiento (+2 años)
        if (field === 'fechaEleccion' && arrayName === 'delegados') {
            const fecha = new Date(value);
            fecha.setFullYear(fecha.getFullYear() + 2);
            newArray[index]['vencimiento'] = fecha.toISOString().split('T')[0];
        }
        
        setCedi({ ...cedi, [arrayName]: newArray });
    };

    const addElement = (arrayName) => {
        const newItem = arrayName === 'delegados' 
            ? { nombre: '', cargo: '', ci: '', telefono: '', fechaEleccion: '', vencimiento: '', obs: '' }
            : { nombre: '', cargo: '', ci: '', telefono: '' };
        setCedi({ ...cedi, [arrayName]: [...cedi[arrayName], newItem] });
    };

    const removeElement = (index, arrayName) => {
        const newArray = cedi[arrayName].filter((_, i) => i !== index);
        setCedi({ ...cedi, [arrayName]: newArray });
    };

    const handleSave = async () => {
    try {
        // En lugar de usar 'id' de useParams (que es undefined), 
        // usa 'cedi._id' que viene de la base de datos
        if (!cedi._id) {
            alert("Error: No se encontró el ID del CEDI");
            return;
        }

        await axios.put(`/cedi/${cedi._id}`, cedi);
        
        setEditMode(false);
        alert("Datos actualizados correctamente");
    } catch (error) {
        console.error("Error al guardar:", error.response?.data || error.message);
        alert("Error al guardar los cambios");
    }
};

    if (loading) return <div className="p-5 text-center">Cargando...</div>;
    if (!cedi) return <div className="p-5 text-center text-danger">Error: No se encontraron datos para este CEDI.</div>

    return (
        <div className="container-fluid p-4" style={{ backgroundColor: '#fdfbf7', minHeight: '100vh' }}>
            {/* HEADER: Nombre del CEDI y Acciones */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="fw-bold mb-0 text-dark">{cedi?.cedis}</h2>
                    <span className="text-muted text-uppercase">{cedi?.region}</span>
                    <div className="mt-2">
                        {cedi?.delegados.some(d => new Date(d.vencimiento) < new Date()) && (
                            <span className="badge rounded-pill border border-danger text-danger me-2">Crítico</span>
                        )}
                        <span className="badge rounded-pill bg-light text-dark border">
                            {cedi.delegados.filter(d => new Date(d.vencimiento) < new Date()).length} delegado(s) vencido(s)
                        </span>
                    </div>
                </div>

                <div className="d-flex gap-2">
                    {!editMode ? (
                        <button className="btn btn-outline-secondary rounded-pill px-4 shadow-sm" onClick={() => setEditMode(true)}>
                            <Edit3 size={16} className="me-2" /> Editar
                        </button>
                    ) : (
                        <>
                            <button className="btn btn-success rounded-pill px-4 shadow-sm" onClick={handleSave}>
                                <Save size={16} className="me-2" /> Guardar
                            </button>
                            <button className="btn btn-light rounded-pill px-4 border shadow-sm" onClick={() => setEditMode(false)}>
                                <X size={16} className="me-2" /> Cancelar
                            </button>
                        </>
                    )}
                </div>
            </div>

            {/* INDICADORES RÁPIDOS */}
            <div className="row g-3 mb-4">
                {[
                    { label: 'Trabajadores', val: cedi?.trabajadores, color: 'text-dark' },
                    { label: 'Delegados', val: cedi?.delegados.length, color: 'text-danger' },
                    { label: 'Rep. Patronal', val: cedi?.patronos.length, color: 'text-dark' }
                ].map((stat, i) => (
                    <div key={i} className="col-md-4">
                        <div className="card shadow-sm border-0 text-center p-3 rounded-4">
                            <h3 className={`fw-bold mb-0 ${stat.color}`}>{stat.val}</h3>
                            <small className="text-muted fw-semibold">{stat.label}</small>
                        </div>
                    </div>
                ))}
            </div>

            {/* SECCIÓN: COMITÉ Y REPRESENTANTES */}
            <div className="row g-4">
                {/* Delegados */}
                <div className="col-lg-6">
                    <div className="card shadow-sm border-0 p-4 rounded-4 h-100">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h6 className="text-danger fw-bold mb-0">DELEGADOS DE PREVENCIÓN</h6>
                            {editMode && (
                                <button className="btn btn-sm btn-outline-danger rounded-pill" onClick={() => addElement('delegados')}>
                                    <Plus size={14} /> Agregar
                                </button>
                            )}
                        </div>

                        <div className="overflow-auto" style={{maxHeight: '500px'}}>
                            {cedi.delegados.map((del, idx) => (
                                <div key={idx} className="mb-3 p-3 border rounded-3 bg-white position-relative shadow-sm">
                                    {editMode ? (
                                        <div className="row g-2">
                                            <div className="col-12 d-flex justify-content-end">
                                                <button className="btn btn-sm text-danger" onClick={() => removeElement(idx, 'delegados')}><X size={14}/></button>
                                            </div>
                                            <div className="col-6">
                                                <label className="text-muted small">Nombre</label>
                                                <input className="form-control form-control-sm" value={del.nombre} onChange={(e) => handleArrayChange(idx, 'nombre', e.target.value, 'delegados')} />
                                            </div>
                                            <div className="col-6">
                                                <label className="text-muted small">Cargo</label>
                                                <input className="form-control form-control-sm" value={del.cargo} onChange={(e) => handleArrayChange(idx, 'cargo', e.target.value, 'delegados')} />
                                            </div>
                                            <div className="col-6">
                                                <label className="text-muted small">Cédula</label>
                                                <input className="form-control form-control-sm" value={del.ci} onChange={(e) => handleArrayChange(idx, 'ci', e.target.value, 'delegados')} />
                                            </div>
                                            <div className="col-6">
                                                <label className="text-muted small">Fecha Elección</label>
                                                <input type="date" className="form-control form-control-sm" value={del.fechaEleccion?.split('T')[0]} onChange={(e) => handleArrayChange(idx, 'fechaEleccion', e.target.value, 'delegados')} />
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="d-flex gap-3 align-items-center">
                                            <div className="bg-danger text-white rounded-circle d-flex align-items-center justify-content-center fw-bold" style={{ width: '45px', height: '45px' }}>
                                                {del.nombre?.charAt(0) || '?'}
                                            </div>
                                            <div>
                                                <h6 className="mb-0 fw-bold">{del.nombre}</h6>
                                                <small className="text-muted">{del.cargo}</small>
                                                <div className="mt-1">
                                                    <span className="badge bg-light text-dark border me-1">ID: {del.ci}</span>
                                                    <span className="badge bg-light text-dark border">Vence: {del.vencimiento ? new Date(del.vencimiento).toLocaleDateString() : 'N/A'}</span>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Representantes del Patrono */}
                <div className="col-lg-6">
                    <div className="card shadow-sm border-0 p-4 rounded-4 h-100">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h6 className="text-warning fw-bold mb-0">REPRESENTANTES DEL PATRONO</h6>
                            {editMode && (
                                <button className="btn btn-sm btn-outline-warning rounded-pill" onClick={() => addElement('patronos')}>
                                    <Plus size={14} /> Agregar
                                </button>
                            )}
                        </div>
                        <div className="overflow-auto" style={{maxHeight: '500px'}}>
                            {cedi.patronos.map((pat, idx) => (
                                <div key={idx} className="mb-3 p-3 border rounded-3 bg-white shadow-sm">
                                    {/* Similar estructura que delegados pero con color warning */}
                                    <div className="d-flex gap-3 align-items-center">
                                        <div className="bg-warning-subtle text-warning rounded-circle d-flex align-items-center justify-content-center fw-bold" style={{ width: '45px', height: '45px' }}>
                                            {pat.nombre.charAt(0)}
                                        </div>
                                        <div className="flex-grow-1">
                                            <h6 className="mb-0 fw-bold text-uppercase">{pat.nombre}</h6>
                                            <small className="text-muted">{pat.cargo}</small>
                                        </div>
                                        {editMode && <button className="btn btn-sm text-danger" onClick={() => removeElement(idx, 'patronos')}><X size={14}/></button>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* SECCIÓN: CUMPLIMIENTO MENSUAL */}
            <div className="card shadow-sm border-0 p-4 rounded-4 mt-4">
                <h6 className="fw-bold mb-4 border-bottom pb-2">CUMPLIMIENTO MENSUAL 2026</h6>
                <div className="row g-4">
                    {/* Formación SST */}
                    <div className="col-md-6 border-end">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <small className="fw-bold text-muted">🎓 FORMACIÓN SST</small>
                            <span className="badge bg-success-subtle text-success">100% AL DÍA</span>
                        </div>
                        <div className="d-flex flex-wrap gap-2">
                            {['EN', 'FE', 'MA', 'AB', 'MY', 'JN', 'JL', 'AG', 'SE', 'OC', 'NO', 'DI'].map((mes, i) => (
                                <span key={mes} className={`badge rounded-circle d-flex align-items-center justify-content-center ${i < 3 ? 'bg-success text-white' : 'bg-light text-muted border'}`} style={{width: '32px', height: '32px', fontSize: '10px'}}>
                                    {mes}
                                </span>
                            ))}
                        </div>
                    </div>
                    {/* Informes CSSL */}
                    <div className="col-md-6">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <small className="fw-bold text-muted">📋 INFORMES CSSL → INPSASEL</small>
                            <span className="badge bg-danger-subtle text-danger">0% PENDIENTE</span>
                        </div>
                        <div className="d-flex flex-wrap gap-2">
                            {['EN', 'FE', 'MA', 'AB', 'MY', 'JN', 'JL', 'AG', 'SE', 'OC', 'NO', 'DI'].map((mes, i) => (
                                <span key={mes} className={`badge rounded-circle d-flex align-items-center justify-content-center ${i < 3 ? 'bg-danger text-white' : 'bg-light text-muted border'}`} style={{width: '32px', height: '32px', fontSize: '10px'}}>
                                    {mes}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* SECCIÓN: GESTIÓN DOCUMENTAL (CARDS PEQUEÑAS) */}
            <h5 className="mt-5 mb-3 fw-bold text-secondary">Estatus de Gestión Documental</h5>
            <div className="row g-3">
                {[
                    { title: '🏥 SSST', label: 'Registrado INPSASEL', val: cedi.ssst.reg, type: 'status' },
                    { title: '📄 PROGRAMA', label: 'Estatus', val: cedi.psst.aprobado, type: 'status' },
                    { title: '👥 COMITÉ', label: 'Registro', val: 'Vigente', type: 'status' },
                    { title: '📢 POLÍTICA', label: 'Divulgada', val: 'Sin evidencia', type: 'warning' }
                ].map((item, i) => (
                    <div key={i} className="col-md-3">
                        <div className="card shadow-sm border-0 p-3 rounded-4 h-100">
                            <h6 className="small fw-bold text-muted mb-3">{item.title}</h6>
                            <div className="d-flex justify-content-between align-items-center">
                                <span className="small text-muted">{item.label}</span>
                                <span className={`fw-bold small ${item.val === 'SI' || item.val === 'Vigente' ? 'text-success' : 'text-danger'}`}>
                                    {item.val}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* ACCIDENTABILIDAD */}
            <div className="row g-4 mt-2">
                <div className="col-md-8">
                    <div className="card shadow-sm border-0 p-4 rounded-4 h-100">
                        <div className="d-flex justify-content-between mb-4">
                            <h6 className="fw-bold text-muted mb-0">⚠ DATOS BASE ACCIDENTABILIDAD 2026</h6>
                            <button className="btn btn-sm btn-light border rounded-pill px-3">Editar</button>
                        </div>
                        <div className="row g-3 text-center">
                            {['HHE CARGADO', 'NLPT', 'NLT'].map((label, i) => (
                                <div key={i} className="col-4">
                                    <div className="bg-light p-3 rounded-4 border">
                                        <small className="d-block text-muted mb-1" style={{fontSize: '10px'}}>{label}</small>
                                        <span className="h5 fw-bold mb-0">0</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card shadow-sm border-0 p-4 rounded-4 bg-dark text-white h-100">
                        <h6 className="small fw-bold mb-3 text-warning">📐 FÓRMULAS APLICADAS</h6>
                        <div className="vstack gap-2">
                            <div className="p-2 bg-secondary bg-opacity-25 rounded-2 small border border-secondary">
                                <strong>IFN:</strong> NLPT × K / HHE
                            </div>
                            <div className="p-2 bg-secondary bg-opacity-25 rounded-2 small border border-secondary">
                                <strong>IFB:</strong> NLT × K / HHE
                            </div>
                            <div className="p-2 bg-secondary bg-opacity-25 rounded-2 small border border-secondary">
                                <strong>IS:</strong> (TDC + TDP) × K / HHE
                            </div>
                        </div>
                        <small className="text-muted mt-3" style={{fontSize: '9px'}}>K = 1.000.000 horas-hombre</small>
                    </div>
                </div>
            </div>
        </div>
     );
};

export default DetalleMerida;