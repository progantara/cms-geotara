import React, { Component } from "react";
import { Link } from "react-router-dom";
import DropFile from "./DropFile";
import MaterialTime from "./MaterialTime";

class WisataForm extends Component {
   render() {
      return (
         <div className="h-80">
            <div className="row">
               <div className="col-xl-12 col-xxl-12">
                  <div className="card">
                     <div className="card-header">
                        <h4 className="card-title">Tambah Wisata</h4>
                     </div>
                     <div className="card-body">
                        <div className="summernote">
                           <div className="card">
                              <div className="card-body">
                                 <div className="basic-form">
                                    <form onSubmit={(e) => e.preventDefault()}>
                                       <div className="row">
                                          <label>Cover</label>
                                          <DropFile />
                                          <div className="form-group mb-3 col-md-6">
                                             <label>Nama</label>
                                             <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Masukkan Nama"
                                             />
                                          </div>
                                          <div className="form-group mb-3 col-md-6">
                                             <label>Kategori</label>
                                             <select
                                                defaultValue={"option"}
                                                id="inputKategori"
                                                className="form-control"
                                             >
                                                <option value="option" disabled>
                                                   Pilih Kategori
                                                </option>
                                                <option>Option 1</option>
                                                <option>Option 2</option>
                                                <option>Option 3</option>
                                             </select>
                                          </div>
                                          <div className="form-group mb-6">
                                             <label>Deskripsi</label>
                                             <textarea
                                                className="form-control"
                                                placeholder="Masukkan Deskripsi"
                                                id="description"
                                             ></textarea>
                                          </div> 
                                       </div>
                                       <div className="row">
                                          <div className="col-xl-2 col-xxl-6 col-md-4 mb-3">
                                             <label>Waktu Mulai</label>
                                             <MaterialTime />
                                          </div>
                                          <div className="col-xl-3 col-xxl-6 col-md-4 mb-3">
                                             <label>Waktu Akhir</label>
                                             <MaterialTime />
                                          </div>
                                       </div>
                                       <div className="row">
                                          <div className="form-group mb-3 col-md-6">
                                             <label>Kota</label>
                                             <select
                                                defaultValue={"option"}
                                                id="inputKota"
                                                className="form-control"
                                             >
                                                <option value="option" disabled>
                                                   Pilih Kota
                                                </option>
                                                <option>Option 1</option>
                                                <option>Option 2</option>
                                                <option>Option 3</option>
                                             </select>
                                          </div>
                                          <div className="form-group mb-3 col-md-6">
                                             <label>Provinsi</label>
                                             <select
                                                defaultValue={"option"}
                                                id="inputProvinsi"
                                                className="form-control"
                                             >
                                                <option value="option" disabled>
                                                   Pilih Provinsi
                                                </option>
                                                <option>Option 1</option>
                                                <option>Option 2</option>
                                                <option>Option 3</option>
                                             </select>
                                          </div>
                                       </div>
                                       <Link to="/wisata-table">
                                          <button type="submit" className="btn btn-primary">Submit</button>
                                       </Link>
                                    </form>
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
}

export default WisataForm;