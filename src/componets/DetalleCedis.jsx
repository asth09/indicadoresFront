import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCedisByNameRequest } from '../api/cedis';
import { Save, X, Plus, Edit3, ChevronUp, ChevronDown } from 'lucide-react';
import DashboardSafetyCards  from "./DashboardSafetyCards";
import { useTheme } from '../context/ThemeContext';
import axios from "axios";

const DetalleCedis = () => {
    // 1. CAMBIO CLAVE: Usamos 'name' porque así lo definimos en el App.jsx /cedis/:name
    const { name } = useParams(); 
    const navigate = useNavigate();
    const { theme } = useTheme(); 
    const isDark = theme === 'dark';
    const [loading, setLoading] = useState(true);
    const [editMode, setEditMode] = useState(false);
    const [cedi, setCedi] = useState(null);

    const styles = {
        bgMain: isDark ? '#111827' : '#f8f9fc',         
        bgCard: isDark ? '#1f2937' : '#ffffff',         
        bgInput: isDark ? '#111827' : '#ffffff',        
        textTitle: isDark ? '#ffffff' : '#4e73df',      
        textBody: isDark ? '#f3f4f6' : '#2d3748',       
        textMuted: isDark ? '#9ca3af' : '#858796',      
        border: isDark ? 'rgba(255, 255, 255, 0.08)' : '1px solid #e3e6f0',
        transition: 'background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease'
    };

    useEffect(() => {
        const fetchCedi = async () => {
            if (!name) return; // Seguridad si el nombre no llega
            
            setLoading(true);
            try {
                // 2. Usamos el 'name' de la URL correctamente
                const res = await getCedisByNameRequest(name.toLowerCase()); 
                setCedi(res.data);
                setLoading(false);
            } catch (error) {
                console.error("Error al cargar el CEDI", error);
                setLoading(false);
            }
        };
        fetchCedi();
    }, [name]); // 3. Se dispara cada vez que el nombre en la URL cambia (Sidebar)

    // --- MANEJO DE CAMBIOS ---
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

    const handleArrayChange = (index, field, value, arrayName) => {
        const newArray = [...cedi[arrayName]];
        newArray[index][field] = value;
        
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
        setCedi({ ...cedi, [arrayName]: [...(cedi[arrayName] || []), newItem] });
    };

    const removeElement = (index, arrayName) => {
        const newArray = cedi[arrayName].filter((_, i) => i !== index);
        setCedi({ ...cedi, [arrayName]: newArray });
    };

    const handleSave = async () => {
    try {
    const { _id, createdAt, updatedAt, __v, ...datosLimpios } = cedi;
    
    if (datosLimpios.delegados) {
        datosLimpios.delegados = datosLimpios.delegados.map(({ _id, ...resto }) => resto);
    }
    if (datosLimpios.patronos) {
        datosLimpios.patronos = datosLimpios.patronos.map(({ _id, ...resto }) => resto);
    }

    const respuesta = await axios.put(`http://localhost:3000/api/cedi/${cedi._id}`, datosLimpios);
    
    // Si llegó aquí, todo salió bien
    setEditMode(false);
    alert("Datos actualizados correctamente");

} catch (error) {
    // 🔍 Validamos si la petición realmente se completó con éxito (Status 200 o 204)
    if (error.response?.status === 200 || error.response?.status === 204) {
        setEditMode(false);
        alert("Datos actualizados correctamente");
        return; 
    }

    // Si es un error real de red o base de datos, se muestra este
    console.error("Error real del servidor:", error.response?.data || error.message);
    alert(`Error al guardar: ${error.response?.data?.message || "Revisa la consola"}`);
}
};

    // --- VISTAS DE ESTADO CONTROLLADAS ---
    if (loading) return (
        <div className="p-5 text-center bg-body text-body" style={{ minHeight: '100vh' }}>
            <div className="spinner-border text-primary" role="status"></div>
            <p className="mt-2 text-secondary">Cargando indicadores de {name}...</p>
        </div>
    );

    if (!cedi) return (
        <div className="p-5 text-center bg-body text-body" style={{ minHeight: '100vh' }}>
            <div className="alert alert-warning d-inline-block shadow-sm">
                No se encontraron datos para <strong>{name}</strong> en la base de datos de MongoDB.
            </div>
            <div>
                <button className="btn btn-primary rounded-pill px-4" onClick={() => navigate('/')}>Volver al inicio</button>
            </div>
        </div>
    );

    // --- RENDER PRINCIPAL ---
    return (
        <div className="container-fluid p-4" style={{ backgroundColor: styles.bgMain, minHeight: '100vh', transition: styles.transition }}>
    
            {/* HEADER: Nombre y Alertas */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="fw-bold mb-0 text-uppercase" style={{ color: styles.textTitle }}>{cedi.cedis || name}</h2>
                    <span style={{ fontSize: '0.9rem', letterSpacing: '1px', color: styles.textMuted }} className="text-uppercase fw-semibold">
                        {cedi.region || 'Sin Región'}
                    </span>
                    <div className="mt-2">
                        {cedi.delegados?.some(d => new Date(d.vencimiento) < new Date()) && (
                            <span className="badge rounded-pill border border-danger text-white me-2 bg-danger bg-opacity-10">Crítico</span>
                        )}
                        <span className={`badge rounded-pill border ${isDark ? 'bg-dark text-light border-secondary border-opacity-25' : 'bg-light text-dark border-secondary-subtle'}`}>
                            {cedi.delegados?.filter(d => d.vencimiento && new Date(d.vencimiento) < new Date()).length || 0} delegado(s) vencido(s)
                        </span>
                    </div>
                </div>

                <div className="d-flex gap-2">
                    {!editMode ? (
                        <button 
                            className={`btn rounded-pill px-4 shadow-sm ${isDark ? 'btn-outline-light border-opacity-25' : 'btn-outline-primary'}`} 
                            onClick={() => setEditMode(true)} 
                            style={{ backgroundColor: styles.bgCard, transition: styles.transition }}
                        >
                            <Edit3 size={16} className="me-2" /> Editar
                        </button>
                    ) : (
                        <>
                            
                            <button className="btn btn-outline-danger rounded-pill px-4 shadow-sm" onClick={() => setEditMode(false)}>
                                <X size={16} className="me-2" /> Cancelar
                            </button>
                        </>
                    )}
                </div>
            </div>

    {/* INDICADORES RÁPIDOS */}
            <div className="row g-3 mb-4">
                {[
                    { label: 'Trabajadores', val: cedi.trabajadores || 0, color: isDark ? 'text-white' : 'text-dark' },
                    { label: 'Delegados', val: cedi.delegados?.length || 0, color: 'text-danger' },
                    { label: 'Rep. Patronal', val: cedi.patronos?.length || 0, color: 'text-info' }
                ].map((stat, i) => (
                    <div key={i} className="col-md-4">
                        <div className="card shadow-sm border-0 text-center p-3 rounded-4" style={{ backgroundColor: styles.bgCard, transition: styles.transition }}>
                            <h3 className={`fw-bold mb-0 ${stat.color}`}>{stat.val}</h3>
                            <small className="fw-semibold text-uppercase" style={{ fontSize: '0.7rem', color: styles.textMuted }}>{stat.label}</small>
                        </div>
                    </div>
                ))}
            </div>
    
    {/* SECCIÓN DE DELEGADOS Y PATRONOS */}
            <div className="row g-4 mb-4">
                {/* Delegados */}
                <div className="col-lg-6">
                    <div className="card shadow-sm border-0 p-4 rounded-4 h-100" style={{ backgroundColor: styles.bgCard, border: styles.border, transition: styles.transition }}>
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h6 className="text-danger fw-bold mb-0 text-uppercase" style={{ letterSpacing: '1px' }}>Delegados de Prevención</h6>
                            {editMode && (
                                <button className="btn btn-sm btn-outline-danger rounded-pill" onClick={() => addElement('delegados')}>
                                    <Plus size={14} /> Agregar
                                </button>
                            )}
                        </div>

                        <div className="overflow-auto pe-2" style={{ maxHeight: '500px', scrollbarWidth: 'thin' }}>
                            {cedi.delegados?.map((del, idx) => (
                                <div key={idx} className="mb-3 p-3 border rounded-3 position-relative shadow-sm" style={{ backgroundColor: styles.bgInput, borderColor: isDark ? 'rgba(255,255,255,0.05)' : '#e3e6f0', transition: styles.transition }}>
                                    {editMode ? (
                                        <div className="row g-2">
                                            <div className="col-12 d-flex justify-content-end">
                                                <button className="btn btn-sm text-danger p-0" onClick={() => removeElement(idx, 'delegados')}><X size={14}/></button>
                                            </div>
                                            <div className="col-6">
                                                <label style={{ color: styles.textMuted }} className="small">Nombre</label>
                                                <input className={`form-control form-control-sm ${isDark ? 'bg-dark text-white border-secondary' : 'bg-light text-dark'}`} value={del.nombre || ''} onChange={(e) => handleArrayChange(idx, 'nombre', e.target.value, 'delegados')} />
                                            </div>
                                            <div className="col-6">
                                                <label style={{ color: styles.textMuted }} className="small">Cargo</label>
                                                <input className={`form-control form-control-sm ${isDark ? 'bg-dark text-white border-secondary' : 'bg-light text-dark'}`} value={del.cargo || ''} onChange={(e) => handleArrayChange(idx, 'cargo', e.target.value, 'delegados')} />
                                            </div>
                                            <div className="col-6">
                                                <label style={{ color: styles.textMuted }} className="small">Cédula</label>
                                                <input className={`form-control form-control-sm ${isDark ? 'bg-dark text-white border-secondary' : 'bg-light text-dark'}`} value={del.ci || ''} onChange={(e) => handleArrayChange(idx, 'ci', e.target.value, 'delegados')} />
                                            </div>
                                            <div className="col-6">
                                                <label style={{ color: styles.textMuted }} className="small">Fecha Elección</label>
                                                <input type="date" className={`form-control form-control-sm ${isDark ? 'bg-dark text-white border-secondary' : 'bg-light text-dark'}`} value={del.fechaEleccion?.split('T')[0] || ''} onChange={(e) => handleArrayChange(idx, 'fechaEleccion', e.target.value, 'delegados')} />
                                            </div>
                                            <div className="col-12">
                                                <label style={{ color: styles.textMuted }} className="small">Observación</label>
                                                <input className={`form-control form-control-sm ${isDark ? 'bg-dark text-white border-secondary' : 'bg-light text-dark'}`} value={del.observacion || ''} onChange={(e) => handleArrayChange(idx, 'observacion', e.target.value, 'delegados')} placeholder="Notas o detalles adicionales..." />
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="d-flex gap-3 align-items-start">
                                            <div className="bg-danger text-white rounded-circle d-flex align-items-center justify-content-center fw-bold shadow-sm flex-shrink-0 mt-1" style={{ width: '45px', height: '45px' }}>
                                                {del.nombre?.charAt(0) || '?'}
                                            </div>
                                            <div className="flex-grow-1">
                                                <h6 className="mb-0 fw-bold" style={{ color: styles.textBody }}>{del.nombre}</h6>
                                                <small className="d-block" style={{ color: styles.textMuted }}>{del.cargo || 'Delegado'}</small>
                                                <div className="mt-1">
                                                    <span className={`badge border me-1 ${isDark ? 'bg-secondary bg-opacity-25 text-white border-secondary' : 'bg-light text-secondary border-secondary-subtle'}`}>ID: {del.ci || 'N/A'}</span>
                                                    <span className={`badge border ${new Date(del.vencimiento) < new Date() ? "bg-danger bg-opacity-10 text-white border-danger" : (isDark ? "bg-secondary bg-opacity-25 text-white border-secondary" : "bg-light text-secondary border-secondary-subtle")}`}>
                                                        Vence: {del.vencimiento ? new Date(del.vencimiento).toLocaleDateString() : 'N/A'}
                                                    </span>
                                                </div>
                                                {del.observacion && (
                                                    <div className="mt-2 p-2 rounded border-start border-danger border-3" style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : '#fff5f5' }}>
                                                        <small className="d-block" style={{ fontSize: '11px', color: styles.textMuted }}><strong>Obs:</strong> {del.observacion}</small>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                {/* Patronos */}
                <div className="col-lg-6">
                    <div className="card shadow-sm border-0 p-4 rounded-4 h-100" style={{ backgroundColor: styles.bgCard, border: styles.border, transition: styles.transition }}>
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h6 className="text-info fw-bold mb-0 text-uppercase" style={{ letterSpacing: '1px' }}>Representantes Patrono</h6>
                            {editMode && (
                                <button className="btn btn-sm btn-outline-info rounded-pill" onClick={() => addElement('patronos')}>
                                    <Plus size={14} /> Agregar
                                </button>
                            )}
                        </div>

                        <div className="overflow-auto pe-2" style={{ maxHeight: '500px', scrollbarWidth: 'thin' }}>
                            {cedi.patronos?.map((pat, idx) => (
                                <div key={idx} className="mb-3 p-3 border rounded-3 position-relative shadow-sm" style={{ backgroundColor: styles.bgInput, borderColor: isDark ? 'rgba(255,255,255,0.05)' : '#e3e6f0', transition: styles.transition }}>
                                    {editMode ? (
                                        <div className="row g-2">
                                            <div className="col-12 d-flex justify-content-end">
                                                <button className="btn btn-sm text-danger p-0" onClick={() => removeElement(idx, 'patronos')}><X size={14}/></button>
                                            </div>
                                            <div className="col-6">
                                                <label style={{ color: styles.textMuted }} className="small">Nombre</label>
                                                <input className={`form-control form-control-sm ${isDark ? 'bg-dark text-white border-secondary' : 'bg-light text-dark'}`} value={pat.nombre || ''} onChange={(e) => handleArrayChange(idx, 'nombre', e.target.value, 'patronos')} />
                                            </div>
                                            <div className="col-6">
                                                <label style={{ color: styles.textMuted }} className="small">Cargo</label>
                                                <input className={`form-control form-control-sm ${isDark ? 'bg-dark text-white border-secondary' : 'bg-light text-dark'}`} value={pat.cargo || ''} onChange={(e) => handleArrayChange(idx, 'cargo', e.target.value, 'patronos')} />
                                            </div>
                                            <div className="col-6">
                                                <label style={{ color: styles.textMuted }} className="small">Cédula</label>
                                                <input className={`form-control form-control-sm ${isDark ? 'bg-dark text-white border-secondary' : 'bg-light text-dark'}`} value={pat.ci || ''} onChange={(e) => handleArrayChange(idx, 'ci', e.target.value, 'patronos')} />
                                            </div>
                                            <div className="col-6">
                                                <label style={{ color: styles.textMuted }} className="small">Teléfono</label>
                                                <input className={`form-control form-control-sm ${isDark ? 'bg-dark text-white border-secondary' : 'bg-light text-dark'}`} value={pat.telefono || ''} onChange={(e) => handleArrayChange(idx, 'telefono', e.target.value, 'patronos')} />
                                            </div>
                                            <div className="col-12">
                                                <label style={{ color: styles.textMuted }} className="small">Observación</label>
                                                <input className={`form-control form-control-sm ${isDark ? 'bg-dark text-white border-secondary' : 'bg-light text-dark'}`} value={pat.observacion || ''} onChange={(e) => handleArrayChange(idx, 'observacion', e.target.value, 'patronos')} placeholder="Notas o detalles adicionales..." />
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="d-flex gap-3 align-items-start">
                                            <div className="bg-info text-white rounded-circle d-flex align-items-center justify-content-center fw-bold shadow-sm flex-shrink-0 mt-1" style={{ width: '45px', height: '45px' }}>
                                                {pat.nombre?.charAt(0) || '?'}
                                            </div>
                                            <div className="flex-grow-1">
                                                <h6 className="mb-0 fw-bold" style={{ color: styles.textBody }}>{pat.nombre}</h6>
                                                <small className="d-block" style={{ color: styles.textMuted }}>{pat.cargo || 'Representante'}</small>
                                                <div className="mt-1">
                                                    <span className={`badge border me-1 ${isDark ? 'bg-secondary bg-opacity-25 text-white border-secondary' : 'bg-light text-secondary border-secondary-subtle'}`}>ID: {pat.ci || 'N/A'}</span>
                                                    <span className={`badge border ${isDark ? 'bg-secondary bg-opacity-25 text-white border-secondary' : 'bg-light text-secondary border-secondary-subtle'}`}>Tel: {pat.telefono || 'N/A'}</span>
                                                </div>
                                                {pat.observacion && (
                                                    <div className="mt-2 p-2 rounded border-start border-info border-3" style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : '#edfdfd' }}>
                                                        <small className="d-block" style={{ fontSize: '11px', color: styles.textMuted }}><strong>Obs:</strong> {pat.observacion}</small>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

    {/* CUMPLIMIENTO MENSUAL (CORREGIDO EL CONTRASTE AQUÍ) */}
            <div className="card shadow-sm border-0 p-4 rounded-4 mt-4" style={{ backgroundColor: styles.bgCard, transition: styles.transition }}>
                <h6 className="fw-bold mb-4 border-bottom pb-2" style={{ color: styles.textMuted, borderColor: isDark ? 'rgba(255,255,255,0.1)' : '#e3e6f0' }}>CUMPLIMIENTO MENSUAL 2026</h6>
                <div className="row g-4">
                    <div className="col-md-6 border-end" style={{ borderColor: isDark ? 'rgba(255,255,255,0.1)' : '#e3e6f0' }}>
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <small className="fw-bold text-muted">🎓 FORMACIÓN SST</small>
                            <span className="badge bg-success bg-opacity-10 text-white border border-success border-opacity-25">AL DÍA</span>
                        </div>
                        <div className="d-flex flex-wrap gap-2">
                            {['EN', 'FE', 'MA', 'AB', 'MY', 'JN', 'JL', 'AG', 'SE', 'OC', 'NO', 'DI'].map((mes, i) => (
                                <span key={mes} className={`badge rounded-circle d-flex align-items-center justify-content-center ${i < 3 ? 'bg-success text-white' : (isDark ? 'bg-dark text-muted border border-secondary border-opacity-25' : 'bg-light text-dark border border-secondary-subtle')}`} style={{width: '32px', height: '32px', fontSize: '10px', fontWeight: 'bold'}}>
                                    {mes}
                                </span>
                            ))}
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <small className="fw-bold text-muted">📋 INFORMES CSSL → INPSASEL</small>
                            <span className="badge bg-danger bg-opacity-10 text-white border border-danger border-opacity-25">PENDIENTE</span>
                        </div>
                        <div className="d-flex flex-wrap gap-2">
                            {['EN', 'FE', 'MA', 'AB', 'MY', 'JN', 'JL', 'AG', 'SE', 'OC', 'NO', 'DI'].map((mes, i) => (
                                <span key={mes} className={`badge rounded-circle d-flex align-items-center justify-content-center ${i < 3 ? 'bg-danger text-white' : (isDark ? 'bg-dark text-muted border border-secondary border-opacity-25' : 'bg-light text-dark border border-secondary-subtle')}`} style={{width: '32px', height: '32px', fontSize: '10px', fontWeight: 'bold'}}>
                                    {mes}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

    {/* ESTATUS DE GESTIÓN DOCUMENTAL */}
            <h5 className="mt-5 mb-3 fw-bold text-uppercase" style={{ fontSize: '0.9rem', color: styles.textMuted }}>Estatus de Gestión Documental</h5>
            <div className="row g-3">
                {[
                    { title: '🏥 SSST', label: 'Registrado INPSASEL', val: cedi.ssst?.reg || 'NO' },
                    { title: '📄 PROGRAMA', label: 'Estatus', val: cedi.psst?.aprobado || 'NO' },
                    { title: '👥 COMITÉ', label: 'Registro', val: cedi.comite?.registro || 'Vigente' },
                    { title: '📢 POLÍTICA', label: 'Divulgada', val: cedi.politica?.divulgada || 'NO' } 
                ].map((item, i) => (
                    <div key={i} className="col-md-3">
                        <div className="card shadow-sm border-0 p-3 rounded-4 h-100" style={{ backgroundColor: styles.bgCard, transition: styles.transition }}>
                            <h6 className="small fw-bold mb-3" style={{ color: styles.textMuted }}>{item.title}</h6>
                            <div className="d-flex justify-content-between align-items-center">
                                <span className="small" style={{ color: styles.textMuted }}>{item.label}</span>
                                <span className={`fw-bold small ${item.val === 'SI' || item.val === 'Vigente' ? 'text-success' : 'text-danger'}`}>
                                    {item.val}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

    {/* ACCIDENTABILIDAD */}
            <div className="row g-4 mt-2 mb-5">
                <div className="col-md-12">
                    <div className="card shadow-sm border-0 p-4 rounded-4" style={{ backgroundColor: styles.bgCard, transition: styles.transition }}>
                        <div className="d-flex justify-content-between align-items-start mb-2">
                            <div>
                                <h6 className="fw-bold mb-1 text-uppercase" style={{ fontSize: '14px', color: isDark ? '#f3f4f6' : '#4e73df' }}>
                                    ⚠️ DATOS BASE DE ACCIDENTABILIDAD 2026
                                </h6>
                            </div>
                            {!editMode && (
                                <div className="d-flex gap-2">
                                    <button className={`btn btn-sm px-4 rounded-pill border ${isDark ? 'border-secondary text-light bg-dark' : 'btn-outline-primary'}`} onClick={() => setEditMode(true)}>
                                        <Edit3 size={14} className="me-1" /> Editar
                                    </button>
                                </div>
                            )}
                        </div>

                <hr className="my-3" style={{ borderColor: isDark ? 'rgba(255,255,255,0.1)' : '#e3e6f0' }} />

                        {!editMode ? (
                            <div className="row g-3 text-start">
                                {[
                                    { l: 'HHE CARGADO', v: cedi.accidentabilidad?.hhe?.reduce((acc, curr) => acc + Number(curr || 0), 0) },
                                    { l: 'NLPT', v: cedi.accidentabilidad?.nlpt?.reduce((acc, curr) => acc + Number(curr || 0), 0) },
                                    { l: 'NLT', v: cedi.accidentabilidad?.nlt?.reduce((acc, curr) => acc + Number(curr || 0), 0) },
                                    { l: 'TDC', v: cedi.accidentabilidad?.tdc?.reduce((acc, curr) => acc + Number(curr || 0), 0) },
                                    { l: 'TDP', v: cedi.accidentabilidad?.tdp?.reduce((acc, curr) => acc + Number(curr || 0), 0) }
                                ].map((item, i) => (
                                    <div key={i} className="col-md-4">
                                        <div className="p-3 rounded-4 border shadow-sm h-100" style={{ backgroundColor: styles.bgInput, borderColor: isDark ? 'rgba(255,255,255,0.05)' : '#e3e6f0', transition: styles.transition }}>
                                            <small className="d-block fw-bold mb-2" style={{ fontSize: '10px', color: styles.textMuted }}>{item.l}</small>
                                            <span className="h4 fw-bold mb-0" style={{ color: styles.textBody }}>{Number(item.v || 0).toLocaleString('de-DE')}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="table-responsive mt-3">
                                <table className="table table-borderless align-middle">
                                    <thead>
                                        <tr className="text-center" style={{ fontSize: '12px', color: styles.textMuted, borderBottom: isDark ? '1px solid rgba(255,255,255,0.05)' : '1px solid #e3e6f0' }}>
                                            <th className="text-start pb-3">Variable / Mes</th>
                                            {['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto'].map(m => (
                                                <th key={m} className="pb-3 fw-bold text-uppercase" style={{ letterSpacing: '0.5px' }}>{m}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {[
                                            { n: 'HHE - Horas-hombre exposición', key: 'hhe' },
                                            { n: 'NLPT - Lesiones con pérdida', key: 'nlpt' },
                                            { n: 'NLT - Número total lesiones', key: 'nlt' },
                                            { n: 'TDC - Total días cargados', key: 'tdc' },
                                            { n: 'TDP - Total días perdidos', key: 'tdp' }
                                        ].map((row, idx) => (
                                            <tr key={idx} style={{ borderBottom: isDark ? '1px solid rgba(255,255,255,0.03)' : '1px solid #f8f9fc' }}>
                                                <td className="fw-bold small" style={{ width: '220px', color: styles.textMuted }}>
                                                    {row.n}
                                                </td>
                                                {Array(8).fill(0).map((_, monthIdx) => (
                                                    <td key={monthIdx}>
                                                        <input 
                                                            type="number" 
                                                            className={`form-control form-control-sm text-center ${isDark ? 'bg-dark text-white border-secondary' : 'bg-light text-dark'}`}
                                                            value={cedi.accidentabilidad?.[row.key]?.[monthIdx] || 0}
                                                            onChange={(e) => {
                                                                const newAcc = { ...cedi.accidentabilidad };
                                                                if (!newAcc[row.key]) newAcc[row.key] = Array(12).fill(0);
                                                                newAcc[row.key][monthIdx] = Number(e.target.value);
                                                                setCedi({ ...cedi, accidentabilidad: newAcc });
                                                            }}
                                                        />
                                                    </td>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
    
                        <div className="d-flex justify-content-end gap-3 mt-4">
                            <button 
                                className="btn btn-sm btn-outline-secondary rounded-pill px-4 text-light border-opacity-25" 
                                onClick={() => setEditMode(false)}
                            >
                                Descartar
                            </button>
                            <button 
                                className="btn btn-success btn-sm rounded-pill px-4 shadow-sm" 
                                onClick={() => {
                                    /* Aquí iría tu lógica para actualizar en MongoDB */
                                    setEditMode(false);
                                }}
                            >
                                Actualizar Indicadores 2026
                            </button>
                        </div>
                    </div>
                )}
            </div>
            <br/>
            <div className="col-md-4">
    <div 
        className="card shadow-lg border-0 p-4 rounded-4 h-100 d-flex flex-column" 
        style={{ 
            backgroundColor: styles.bgCard, 
            color: styles.textBody,
            transition: styles.transition 
        }}
    >
        {/* El título usa text-warning en oscuro para resaltar, y textTitle en claro para mantener tu branding */}
        <h6 
            className="small fw-bold mb-3 text-uppercase" 
            style={{ 
                color: isDark ? '#ffc107' : styles.textTitle, // #ffc107 es el 'text-warning' nativo de Bootstrap
                letterSpacing: '0.5px' 
            }}
        >
            📐 FÓRMULAS APLICADAS
        </h6>

        <div className="vstack gap-2">
            <div 
                className="p-2 rounded-2 small" 
                style={{ 
                    backgroundColor: styles.bgInput, 
                    border: styles.border,
                    transition: styles.transition
                }}
            >
                <strong style={{ color: isDark ? '#38bdf8' : '#4e73df' }}>IFN:</strong> NLPT × K / HHE
            </div>
            
            <div 
                className="p-2 rounded-2 small" 
                style={{ 
                    backgroundColor: styles.bgInput, 
                    border: styles.border,
                    transition: styles.transition
                }}
            >
                <strong style={{ color: isDark ? '#38bdf8' : '#4e73df' }}>IFB:</strong> NLT × K / HHE
            </div>
            
            <div 
                className="p-2 rounded-2 small" 
                style={{ 
                    backgroundColor: styles.bgInput, 
                    border: styles.border,
                    transition: styles.transition
                }}
            >
                <strong style={{ color: isDark ? '#38bdf8' : '#4e73df' }}>IS:</strong> (TDC + TDP) × K / HHE
            </div>
        </div>

        <small 
            className="mt-auto pt-3 fw-medium" 
            style={{ 
                color: styles.textMuted,
                fontSize: '11px', 
                letterSpacing: '0.5px',
                transition: styles.transition
            }}
        >
            K = 1.000.000 horas-hombre
        </small>
    </div>
</div>
            <DashboardSafetyCards/>
        </div>
    </div>
</div>
    );
};

export default DetalleCedis;