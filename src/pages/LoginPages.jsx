import { useForm } from "react-hook-form";
import { useAuth } from "../context/AuthContext";
import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

function LoginPages() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { signin, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const onSubmit = handleSubmit((data) => {
    signin(data);
  });

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated]);

  return (
    <div className="bg-gradient-primary" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
      <div className="container">
        {/* Outer Row */}
        <div className="row justify-content-center">
          <div className="col-xl-10 col-lg-12 col-md-9">
            <div className="card o-hidden border-0 shadow-lg my-5">
              <div className="card-body p-0">
                {/* Nested Row within Card Body */}
                <div className="row">
                  <div className="col-lg-6 d-none d-lg-block bg-login-image">
                    {/* Aquí puedes poner una imagen o dejar que la clase CSS maneje el fondo */}
                    <img className="img-fluid" src="img/vector.jpg" alt="" />
                  </div>
                  <div className="col-lg-6">
                    <div className="p-5">
                      <div className="text-center">
                        <h1 className="h4 text-gray-900 mb-4">¡Bienvenidos!</h1>
                      </div>
                      
                      <form className="user" onSubmit={onSubmit}>
                        <div className="form-group">
                          <input
                            type="text"
                            {...register("usuario", { required: "El usuario es requerido" })}
                            className={`form-control form-control-user ${errors.usuario ? 'is-invalid' : ''}`}
                            placeholder="Ingrese su usuario..."
                          />
                          {errors.usuario && (
                            <small className="text-danger ml-3">{errors.usuario.message}</small>
                          )}
                        </div>

                        <div className="form-group mt-3">
                          <input
                            type="password"
                            {...register("password", { required: "La contraseña es requerida" })}
                            className={`form-control form-control-user ${errors.password ? 'is-invalid' : ''}`}
                            placeholder="Contraseña"
                          />
                          {errors.password && (
                            <small className="text-danger ml-3">{errors.password.message}</small>
                          )}
                        </div>

                        <div className="form-group mt-3">
                          <div className="custom-control custom-checkbox small">
                            <input
                              type="checkbox"
                              className="custom-control-input"
                              id="customCheck"
                            />
                            <label className="custom-control-label" htmlFor="customCheck">
                              Recordarme
                            </label>
                          </div>
                        </div>

                        <button type="submit" className="btn btn-primary btn-user btn-block mt-4">
                          Login
                        </button>
                      </form>

                      <hr />
                     
                      <div className="text-center">
                        <Link className="small" to="/register">
                          ¡Crear una cuenta!
                        </Link>
                      </div>
                    </div>
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

export default LoginPages;