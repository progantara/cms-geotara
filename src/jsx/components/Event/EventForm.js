import React, { Component } from "react";
import MaterialTime from "./MaterialTime";
import { Link } from "react-router-dom";

class EventForm extends Component {
   render() {
      return (
         <div className="h-80">
            <div className="row">
               <div className="col-xl-12 col-xxl-12">
                  <div className="card">
                     <div className="card-header">
                        <h4 className="card-title">Tambah Acara</h4>
                     </div>
                     <div className="card-body">
                        <div className="summernote">
                           <div className="card">
                              <div className="card-body">
                                 <div className="basic-form">
                                    <form onSubmit={(e) => e.preventDefault()}>
                                       <div className="row">
                                          <label>Cover</label>
                                          
                                          <div className="form-group mb-3 col-md-6">
                                             <label>Judul</label>
                                             <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Event"
                                             />
                                          </div>
                                          <div className="form-group mb-3 col-md-4">
                                             <label>Organizer</label>
                                             <select
                                                defaultValue={"option"}
                                                id="inputOrganizer"
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
                                                // rows="4"
                                                id="description"
                                                placeholder="Description"
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
                                          <div className="form-group col-md-2">
                                             <label>HTM</label>
                                             <input type="text" className="form-control" placeholder="Gratis" />
                                          </div>
                                       </div>
                                       <div className="row">
                                          <div className="col-xl-3 col-xxl-6 col-md-6 mb-3">
                                             <label>Start</label>
                                             <MaterialTime />
                                          </div>
                                          <div className="col-xl-3 col-xxl-6 col-md-6 mb-3">
                                             <label>End</label>
                                             <MaterialTime />
                                          </div>
                                       </div>
                                       <Link to="/event-table">
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

export default EventForm;