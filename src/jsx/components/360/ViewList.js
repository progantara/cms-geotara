import React, { Fragment, useState } from "react";
import { Alert, Button } from "react-bootstrap";
import emojis from "./emojis";

const ViewList = () => {
    const [imageList, setImageList] = useState([]);
    const [alert, setAlert] = useState();

    const addMoreView = () => {
        if (imageList.length > 0) {
            if (imageList[imageList.length - 1].image) {
                setImageList([...imageList, { id: imageList.length + 1 }]);
            } else {
                setAlert({
                    text: 'Message sending failed.',
                    msg: 'Error!',
                    emoji: emojis.error,
                    variant: 'danger',
                    icon: 'mdi mdi-help',
                });
            }
        } else {
            setImageList([...imageList, { id: imageList.length + 1 }]);
        }
    }

    const changeImage = (e, id) => {
        const newImageList = imageList.map((item) => {
            if (item.id === id) {
                return {
                    ...item,
                    image: e.target.files[0],
                };
            }
            return item;
        });
        setImageList(newImageList);
    };

    const removeImage = (id) => {
        const newImageList = imageList.filter((item) => item.id !== id);
        setImageList(newImageList);
    };

    return (
        <Fragment>
            <div className="row">
                <div className="col-12">
                    <div className="card">
                        <div className="card-header">
                            <h1 className="card-title">
                                360 View's List
                            </h1>

                            <Button className="me-2" variant="primary btn-rounded" onClick={addMoreView}>
                                <span className="btn-icon-start text-primary">
                                    <i className="fa fa-plus color-primary" />
                                </span>
                                Tambah
                            </Button>
                        </div>
                        {alert && (
                            <div className="card-body">
                                <Alert variant={alert.variant} className="alert-dismissible fade show">
                                    {alert.emoji}
                                    <strong>{alert.msg}</strong>
                                    {alert.text}
                                    <Button
                                        variant=""
                                        className="btn-close"
                                        data-bs-dismiss="alert"
                                        aria-label="btn-close"
                                        onClick={() => setAlert()}
                                    />
                                </Alert>
                            </div>
                        )}

                        <div className="row mx-4">
                            {imageList.map((item) => (
                                <div className="col-4" key={item.id}>
                                    <input
                                        type="file"
                                        className="form-control"
                                        id={`formFile${item.id}`}
                                        hidden
                                        onChange={(e) => changeImage(e, item.id)}
                                    />
                                    {item.image ? (
                                        <div className="my-2" onDoubleClick={() => removeImage(item.id)}>
                                            <img
                                                src={URL.createObjectURL(item.image)}
                                                alt="preview"
                                                className="img-fluid border border-2 border-dark rounded-3"
                                                style={{
                                                    width: "400px",
                                                    height: "150px",
                                                }}
                                            />
                                        </div>
                                    ) : (
                                        <label htmlFor={`formFile${item.id}`} className="my-2">
                                            <img
                                                src="https://via.placeholder.com/400x200/FFFFFF?text=Add 360 Image"
                                                alt="preview"
                                                className="img-fluid border border-2 border-dark rounded-3"
                                                style={{ cursor: "pointer" }}
                                            />
                                        </label>
                                    )}
                                </div>
                            ))}
                            {/* <div className="col-4" onDoubleClick={addMoreView}>
                                <div className="my-2">
                                    <img
                                        src="https://via.placeholder.com/400x200/20C997/FFFFFF?text=Add More View"
                                        alt="preview"
                                        className="img-fluid border border-2 border-dark rounded-3 text-white"
                                    />
                                </div>
                            </div> */}
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    );
}

export default ViewList;