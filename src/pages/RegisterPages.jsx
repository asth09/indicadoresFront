import { useForm } from "react-hook-form";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { useEffect } from "react";

function RegisterPages() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { signup, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated]);

  const onSubmit = handleSubmit(async (values) => {
    signup(values);
  });

  return (
    <div className="bg-gradient-primary" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
      <div className="container">
        <div className="card o-hidden border-0 shadow-lg my-5">
          <div className="card-body p-0">
            {/* Nested Row within Card Body */}
            <div className="row">
              <div className="col-lg-5 d-none d-lg-block bg-register-image">
                {/* Imagen de fondo gestionada por CSS */}
                <img className="img-fluid" src="img/segu.jpg" alt="" />
              </div>
              <div className="col-lg-7">
                <div className="p-5">
                  <div className="text-center">
                    <h1 className="h4 text-gray-900 mb-4">¡Crear una cuenta!</h1>
                  </div>

                  <form className="user" onSubmit={onSubmit}>
                    <div className="form-group row">
                      <div className="col-sm-6 mb-3 mb-sm-0">
                        <input
                          type="text"
                          {...register("usuario", { required: "El usuario es requerido" })}
                          className={`form-control form-control-user ${errors.usuario ? 'is-invalid' : ''}`}
                          placeholder="Nombre de usuario"
                        />
                        {errors.usuario && (
                          <small className="text-danger ml-3">{errors.usuario.message}</small>
                        )}
                      </div>
                      <div className="col-sm-6">
                        <select
                          className={`form-control ${errors.role ? 'is-invalid' : ''}`}
                          style={{ borderRadius: '10rem', fontSize: '0.8rem', height: '3.2rem', padding: '0 1rem' }}
                          {...register("role", { required: "Selecciona un rol" })}
                        >
                          <option value="">Selecciona un rol</option>
                          <option value="Gerente">Gerente</option>
                          <option value="Analista">Analista</option>
                        </select>
                        {errors.role && (
                          <small className="text-danger ml-3">{errors.role.message}</small>
                        )}
                      </div>
                    </div>

                    <div className="form-group mt-3">
                      <input
                        type="password"
                        {...register("password", { 
                          required: "La contraseña es requerida",
                          minLength: { value: 6, message: "Mínimo 6 caracteres" }
                        })}
                        className={`form-control form-control-user ${errors.password ? 'is-invalid' : ''}`}
                        placeholder="Contraseña"
                      />
                      {errors.password && (
                        <small className="text-danger ml-3">{errors.password.message}</small>
                      )}
                    </div>

                    <button type="submit" className="btn btn-primary btn-user btn-block mt-4">
                      Registrar Cuenta
                    </button>
                  </form>

                  <hr />
                  <div className="text-center">
                    <Link className="small" to="/forgot-password">
                      ¿Has olvidado tu contraseña?
                    </Link>
                  </div>
                  <div className="text-center">
                    <Link className="small" to="/login">
                      ¿Ya tienes una cuenta? ¡Inicia sesión!
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterPages;