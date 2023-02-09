import React, { useState, useRef, useEffect } from "react";
import { Button, Modal } from "react-bootstrap";
import { Link } from "react-router-dom";
import swal from "sweetalert";

const UserList = () => {
  const [data, setData] = useState(
    document.querySelectorAll("#job_data tbody tr")
  );
  const [largeModal, setLargeModal] = useState(false);
  const sort = 5;
  const activePag = useRef(0);
  const [test, settest] = useState(0);

  // Active data
  const chageData = (frist, sec) => {
    for (var i = 0; i < data.length; ++i) {
      if (i >= frist && i < sec) {
        data[i].classList.remove("d-none");
      } else {
        data[i].classList.add("d-none");
      }
    }
  };
  // use effect
  useEffect(() => {
    setData(document.querySelectorAll("#job_data tbody tr"));
   // chackboxFun();
  }, [test]);

  // Active pagginarion
  activePag.current === 0 && chageData(0, sort);
  // paggination
  let paggination = Array(Math.ceil(data.length / sort))
    .fill()
    .map((_, i) => i + 1);

  // Active paggination & chage data
  const onClick = (i) => {
    activePag.current = i;
    chageData(activePag.current * sort, (activePag.current + 1) * sort);
    settest(i);
  };

  return (
    <div className="col-12">
      <div className="card">
        <div className="card-header">
          <h4 className="card-title">Daftar Pengguna</h4>
          <Link
            to="/user/add"
          >
            <Button className="me-2" variant="primary btn-rounded">
              <span className="btn-icon-start text-primary">
                <i className="fa fa-plus color-primary" />
              </span>
              Tambah
            </Button>
          </Link>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <div id="job_data" className="dataTables_wrapper">
              <table
                className="display w-100 dataTable "
                id="example5"
                role="grid"
                aria-describedby="example5_info"
              >
                <thead>
                  <tr role="row">
                    <th className="sorting" style={{ width: "5%" }}>
                      No
                    </th>
                    <th className="sorting" style={{ width: "30%" }}>
                      Nama
                    </th>
                    <th className="sorting" style={{ width: "30%" }}>
                      Email
                    </th>
                    <th className="sorting" style={{ width: "15%" }}>
                      Role
                    </th>
                    <th className="sorting" style={{ width: "20%" }}>
                      Aksi
                    </th>
                  </tr>
                </thead>

                <tbody>
                  <tr className="odd" role="row">
                    <td>1</td>
                    <td className="sorting_1">Arsal Fadilah</td>
                    <td>arsalfaddilah@gmail.com</td>
                    <td>Pengelola</td>
                    <td>
                      <div className="d-flex">
                        <Link
                          href="#"
                          className="btn btn-primary shadow btn-xs sharp me-1"
                        >
                          <i className="fas fa-eye"></i>
                        </Link>
                        <Link
                          to="/user/edit/1"
                          className="btn btn-secondary shadow btn-xs sharp me-1"
                        >
                          <i className="fas fa-pen"></i>
                        </Link>
                        <Link
                          href="#"
                          className="btn btn-danger shadow btn-xs sharp"
                          onClick={() =>
                            swal({
                              title: "Anda yakin ingin menghapus pengguna ini?",
                              text:
                                "Setelah dihapus, Anda tidak akan dapat memulihkannya",
                              icon: "warning",
                              buttons: true,
                              dangerMode: true,
                            }).then((willDelete) => {
                              if (willDelete) {
                                swal("Pengguna telah dihapus!", {
                                  icon: "success",
                                });
                              }
                            })
                          }
                        >
                          <i className="fa fa-trash"></i>
                        </Link>
                      </div>
                    </td>
                  </tr>
                  <tr className="even" role="row">
                    <td>2</td>
                    <td className="sorting_1">Arsal Fadilah</td>
                    <td>arsalfaddilah@gmail.com</td>
                    <td>Pengelola</td>
                    <td>
                      <div className="d-flex">
                        <Link
                          href="#"
                          className="btn btn-primary shadow btn-xs sharp me-1"
                        >
                          <i className="fas fa-eye"></i>
                        </Link>
                        <Link
                          to="/user/edit/2"
                          className="btn btn-secondary shadow btn-xs sharp me-1"
                        >
                          <i className="fas fa-pen"></i>
                        </Link>
                        <Link
                          href="#"
                          className="btn btn-danger shadow btn-xs sharp"
                          onClick={() =>
                            swal({
                              title: "Anda yakin ingin menghapus pengguna ini?",
                              text:
                                "Setelah dihapus, Anda tidak akan dapat memulihkannya",
                              icon: "warning",
                              buttons: true,
                              dangerMode: true,
                            }).then((willDelete) => {
                              if (willDelete) {
                                swal("Pengguna telah dihapus!", {
                                  icon: "success",
                                });
                              }
                            })
                          }
                        >
                          <i className="fa fa-trash"></i>
                        </Link>
                      </div>
                    </td>
                  </tr>
                  <tr className="odd" role="row">
                    <td>3</td>
                    <td className="sorting_1">Arsal Fadilah</td>
                    <td>arsalfaddilah@gmail.com</td>
                    <td>Pengelola</td>
                    <td>
                      <div className="d-flex">
                        <Link
                          href="#"
                          className="btn btn-primary shadow btn-xs sharp me-1"
                          onClick={() => setLargeModal(true)}
                        >
                          <i className="fas fa-eye"></i>
                          <Modal
                            className="fade bd-example-modal-lg"
                            show={largeModal}
                            size="lg"
                          >
                            <Modal.Header>
                              <Modal.Title>Modal title</Modal.Title>
                              <Button
                                variant=""
                                className="btn-close"
                                onClick={() => setLargeModal(false)}
                              >
                                
                              </Button>
                            </Modal.Header>
                            <Modal.Body>Modal body text goes here.</Modal.Body>
                            <Modal.Footer>
                              <Button
                                variant="danger light"
                                onClick={() => setLargeModal(false)}
                              >
                                Close
                              </Button>
                              <Button
                                variant=""
                                type="button"
                                className="btn btn-primary"
                              >
                                Save changes
                              </Button>
                            </Modal.Footer>
                          </Modal>
                        </Link>
                        <Link
                          to="/user/edit/3"
                          className="btn btn-secondary shadow btn-xs sharp me-1"
                        >
                          <i className="fas fa-pen"></i>
                        </Link>
                        <Link
                          href="#"
                          className="btn btn-danger shadow btn-xs sharp"
                          onClick={() =>
                            swal({
                              title: "Anda yakin ingin menghapus pengguna ini?",
                              text:
                                "Setelah dihapus, Anda tidak akan dapat memulihkannya",
                              icon: "warning",
                              buttons: true,
                              dangerMode: true,
                            }).then((willDelete) => {
                              if (willDelete) {
                                swal("Pengguna telah dihapus!", {
                                  icon: "success",
                                });
                              }
                            })
                          }
                        >
                          <i className="fa fa-trash"></i>
                        </Link>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
              <div className="d-sm-flex text-center justify-content-between align-items-center mt-3">
                <div className="dataTables_info">
                  Showing {activePag.current * sort + 1} to{" "}
                  {data.length > (activePag.current + 1) * sort
                    ? (activePag.current + 1) * sort
                    : data.length}{" "}
                  of {data.length} entries
                </div>
                <div
                  className="dataTables_paginate paging_simple_numbers"
                  id="example5_paginate"
                >
                  <Link
                    className="paginate_button previous disabled"
                    to="/user"
                    onClick={() =>
                      activePag.current > 0 && onClick(activePag.current - 1)
                    }
                  >
                    <i className="fa fa-angle-double-left" aria-hidden="true"></i>
                  </Link>
                  <span>
                    {paggination.map((number, i) => (
                      <Link
                        key={i}
                        to="/user"
                        className={`paginate_button  ${
                          activePag.current === i ? "current" : ""
                        } `}
                        onClick={() => onClick(i)}
                      >
                        {number}
                      </Link>
                    ))}
                  </span>
                  <Link
                    className="paginate_button next"
                    to="/user"
                    onClick={() =>
                      activePag.current + 1 < paggination.length &&
                      onClick(activePag.current + 1)
                    }
                  >
                    <i className="fa fa-angle-double-right" aria-hidden="true"></i>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserList;
