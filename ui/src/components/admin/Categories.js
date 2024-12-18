import React, { useState, useEffect } from "react";
import { Button, Container, Row, Col, Modal, Form } from "react-bootstrap";
import { SliderPicker } from "react-color";
import { connect } from "react-redux";
import { loadCategories, createCategory } from "../../api/category";
import { toast } from "react-toastify";
import DeleteCategoryModal from "./DeleteCategoryModal";
import { LOAD_CATEGORIES } from "../../redux/actionTypes";

function Categories(props) {
  const [name, setName] = useState("");
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
            setCategories(responseBodyObject.categories);
            onCategoryLoad(responseBodyObject.categories);
          });
        } else {
          toast.error("Failed to load the categories");
        }
      })
      .catch((e) => toast.error("Failed to load the categories"));
  }

  const [createNewCategoryModalShow, setCreateNewCategoryModalShow] = useState(
    false
  );

  const handleCreateNewCategoryModalClose = () =>
    setCreateNewCategoryModalShow(false);
  const handleCreateNewCategoryModalShow = () =>
    setCreateNewCategoryModalShow(true);

  let selectedColor;
  function handleColorChangeComplete(color) {
    selectedColor = color.hex.substring(1);
  }

  function handleChange(event) {
    if (event.target.name === "name") {
      setName(event.target.value);
    }
  }

  function handleKeyDown(event) {
    if (event.which === 13) {
      handleCreateNewCategorySubmit();
    }
  }

  function handleCreateNewCategorySubmit() {
    createCategory(props.token, name, selectedColor)
      .then((r) => {
        if (r.status === 200) {
          getCategories();
          handleCreateNewCategoryModalClose();
          toast.success("New category created!");
        } else {
          toast.error("Failed to create a new category, try again.");
        }
      })
      .catch((e) => toast.error("Failed to create a new category, try again."));
  }

  // TODO: Refactor CreateCategory to its own modal component
  return (
    <Container>
      <Row>
        <Col xs="10">
          <br></br>
          <Button
            variant="outline-primary"
            onClick={handleCreateNewCategoryModalShow}
          >
            Create new category
          </Button>
          <Modal
            show={createNewCategoryModalShow}
            onHide={handleCreateNewCategoryModalClose}
          >
            <Modal.Header closeButton>
              <Modal.Title>Create new category</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Form.Group controlId="name">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter name"
                    name="name"
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                  />
                </Form.Group>
                <Form.Group controlId="color">
                  <Form.Label>Color</Form.Label>
                  <SliderPicker
                    color="#000000"
                    onChangeComplete={handleColorChangeComplete}
                  />
                </Form.Group>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="secondary"
                onClick={handleCreateNewCategoryModalClose}
              >
                Close
              </Button>
              <Button variant="primary" onClick={handleCreateNewCategorySubmit}>
                Create
              </Button>
            </Modal.Footer>
          </Modal>
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
                  <Button variant="primary">Edit</Button>
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

function mapStateToProps(state) {
  return {
    token: state.user.token,
  };
}

const mapDispatchToProps = (dispatch) => ({
  onCategoryLoad: (categories) =>
    dispatch({ type: LOAD_CATEGORIES, categories }),
});

export default connect(mapStateToProps, mapDispatchToProps)(Categories);
