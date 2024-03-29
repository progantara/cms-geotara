import React, { Component } from "react";
import { Link } from "react-router-dom";
import DropFile from "./KotaDropfile";

class KotaForm extends Component {
   render() {
      return (
         <div className="h-80">
            <div className="row">
               <div className="col-xl-12 col-xxl-12">
                  <div className="card">
                     <div className="card-header">
                        <h4 className="card-title">Form City</h4>
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
                                             <label>Name</label>
                                             <input
                                                type="text"
                                                className="form-control"
                                                placeholder="City"
                                             />
                                          </div>
                                          <div className="form-group mb-3 col-md-4">
                                             <label>Category</label>
                                             <select
                                                defaultValue={"option"}
                                                id="inputCategory"
                                                className="form-control"
                                             >
                                                <option value="option" disabled>
                                                   Choose...
                                                </option>
                                                <option>Option 1</option>
                                                <option>Option 2</option>
                                                <option>Option 3</option>
                                             </select>
                                          </div>
                                          <div className="form-group mb-3">
                                             <label>Description</label>
                                             <textarea
                                                className="form-control"
                                                placeholder="Description"
                                                id="description"
                                             ></textarea>
                                          </div>
                                          {/* <div className="form-group mb-3 col-md-6">
                                             <label>City</label>
                                             <input type="text" className="form-control" />
                                          </div> */}
                                       </div>
                                       <div className="row">
                                          <div className="form-group mb-3 col-md-4">
                                             <label>State</label>
                                             <select
                                                defaultValue={"option"}
                                                id="inputState"
                                                className="form-control"
                                             >
                                                <option value="option" disabled>
                                                   Choose...
                                                </option>
                                                <option>Option 1</option>
                                                <option>Option 2</option>
                                                <option>Option 3</option>
                                             </select>
                                          </div>
                                          <div className="form-group mb-3 col-md-4">
                                             <label>Province</label>
                                             <select
                                                defaultValue={"option"}
                                                id="inputState"
                                                className="form-control"
                                             >
                                                <option value="option" disabled>
                                                   Choose...
                                                </option>
                                                <option>Option 1</option>
                                                <option>Option 2</option>
                                                <option>Option 3</option>
                                             </select>
                                          </div>
                                       </div>
                                       <Link to="/kota-table">
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

export default KotaForm;