import React, { useState, useEffect } from "react";
import { Button, Container, Row, Col, Modal, Form } from "react-bootstrap";
import { connect } from "react-redux";
import { loadCategories } from "../../api/category";
import { toast } from "react-toastify";
import DeleteCategoryModal from "./DeleteCategoryModal";
import CreateNewCategoryModal from "./CreateNewCategoryModal";
import { LOAD_CATEGORIES } from "../../redux/actionTypes";

function Categories(props) {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    getCategories();
  }, []);

  function getCategories() {
    loadCategories()
      .then((r) => {
        if (r.status === 200) {
          r.text().then((responseBody) => {
            let responseBodyObject = JSON.parse(responseBody);
            setCategories(responseBodyObject);
            onCategoryLoad(responseBodyObject);
          });
        } else {
          toast.error("Failed to load the categories");
        }
      })
      .catch((e) => toast.error("Failed to load the categories"));
  }

  return (
    <Container>
      <Row>
        <Col xs="10">
          <br></br>
          <CreateNewCategoryModal createCallback={getCategories} />
          <br></br>
          <br></br>
          {categories.map((v, i) => (
            <div>
              <div key={i}>
                <i
                  className="fa fa-circle"
                  style={{ color: "#" + v.color, fontSize: 10 }}
                ></i>{" "}
                {v.name}
                <div style={{ float: "right" }}>
                  <Button disabled variant="primary">
                    Edit
                  </Button>
                  &nbsp;
                  <DeleteCategoryModal
                    name={v.name}
                    id={v.id}
                    postDeleteCallback={getCategories}
                  />
                </div>
              </div>
              <hr></hr>
            </div>
          ))}
        </Col>
      </Row>
    </Container>
  );
}

const mapDispatchToProps = (dispatch) => ({
  onCategoryLoad: (categories) =>
    dispatch({ type: LOAD_CATEGORIES, categories }),
});

export default connect(null, mapDispatchToProps)(Categories);
