import React from "react";
import { postProduct } from "../../api";
import { useMutation, useQueryClient } from "react-query";
import {
  Box,
  FormControl,
  FormLabel,
  Text,
  Input,
  Textarea,
  Button,
} from "@chakra-ui/react";

import { Link } from "react-router-dom";
import { Formik, FieldArray } from "formik";
import validationSchema from "./validations";
import { message } from "antd";

function NewProduct() {
  const queryClient = useQueryClient();
  const newProductMutation = useMutation(postProduct, {
    onSuccess: () => queryClient.invalidateQueries("admin:products"),
  });

  const handleSubmit = async (values, bag) => {
    console.log(values);

    // Kiểm tra màu sắc trước khi gửi
    const validColors = values.color.filter(color => /^#[0-9A-Fa-f]{6}$/i.test(color));

    message.loading({ content: "Loading...", key: "product_update" });

    const newValues = {
      ...values,
      photos: JSON.stringify(values.photos),
      color: validColors,
    };

    newProductMutation.mutate(newValues, {
      onSuccess: () => {
        message.success({
          content: "Add Product is successfully",
          key: "product_update",
          duration: 2,
        });
      },
    });
  };

  return (
    <div>
      <nav>
        <ul className="admin-menu">
          <li>
            <Link to="/admin">Home</Link>
          </li>
          <li>
            <Link to="/admin/orders">Order</Link>
          </li>
          <li>
            <Link to="/admin/products">Products</Link>
          </li>
        </ul>
      </nav>
      <Box mt={10}>
        <Text fontsize="2xl">Edit</Text>
        <Formik
          initialValues={{
            title: "",
            description: "",
            price: "",
            photos: [],
            color: [],
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({
            handleSubmit,
            errors,
            touched,
            handleChange,
            handleBlur,
            values,
            isSubmitting,
          }) => (
            <>
              <Box>
                <Box my={5} textAlign="left">
                  <form onSubmit={handleSubmit}>
                    <FormControl>
                      <FormLabel>Title</FormLabel>
                      <Input
                        name="title"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.title}
                        disabled={isSubmitting}
                        isInvalid={touched.title && errors.title}
                      />
                      {touched.title && errors.title && (
                        <Text mt={2} color="red.500">
                          {errors.title}
                        </Text>
                      )}
                    </FormControl>
                    <FormControl mt={4}>
                      <FormLabel>Description</FormLabel>
                      <Textarea
                        name="description"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.description}
                        disabled={isSubmitting}
                        isInvalid={touched.description && errors.description}
                      />
                      {touched.description && errors.description && (
                        <Text mt={2} color="red.500">
                          {errors.description}
                        </Text>
                      )}
                    </FormControl>
                    
                    {/* // Form thêm màu */}
                    <FormControl mt={4}>
                      <FormLabel>Color</FormLabel>
                      <FieldArray
                        name="color"
                        render={(arrayHelpers) => (
                          <div>
                            {values.color && values.color.length > 0 ? (
                              values.color.map((color, index) => (
                                <div key={index} style={{ display: 'flex', alignItems: 'center' }}>
                                  <Input
                                    type="color"
                                    name={`color.${index}`}
                                    value={color}
                                    disabled={isSubmitting}
                                    onChange={handleChange}
                                    width="5%"
                                  />
                                  <Button
                                    ml="4"
                                    type="button"
                                    colorScheme="red"
                                    onClick={() => arrayHelpers.remove(index)}
                                  >
                                    Remove
                                  </Button>
                                </div>
                              ))
                            ) : (
                              <Text> </Text>
                            )}
                            <Button
                              mt="5"
                              onClick={() => arrayHelpers.push("#ffffff")} // Default color when adding new color
                            >
                              Add a Color
                            </Button>
                          </div>
                        )}
                      />
                    </FormControl>


                    <FormControl mt={4}>
                      <FormLabel>Price</FormLabel>
                      <Input
                        name="price"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.price}
                        disabled={isSubmitting}
                        isInvalid={touched.description && errors.description}
                      />
                      {touched.price && errors.price && (
                        <Text mt={2} color="red.500">
                          {errors.price}
                        </Text>
                      )}
                    </FormControl>
                    <FormControl mt={4}>
                      <FormLabel>Photos</FormLabel>
                      <FieldArray
                        name="photos"
                        render={(arrayHelpers) => (
                          <div>
                            {values.photos &&
                              values.photos.map((photo, index) => (
                                <div key={index}>
                                  <Input
                                    name={`photos.${index}`}
                                    value={photo}
                                    disabled={isSubmitting}
                                    onChange={handleChange}
                                    width="90%"
                                  />
                                  <Button
                                    ml="4"
                                    type="button"
                                    colorScheme="red"
                                    onClick={() => arrayHelpers.remove(index)}
                                  >
                                    Remove
                                  </Button>
                                </div>
                              ))}
                            <Button
                              mt="5"
                              onClick={() => arrayHelpers.push("")}
                            >
                              Add a Photo
                            </Button>
                          </div>
                        )}
                      />
                    </FormControl>
                    <Button
                      mt={4}
                      width="full"
                      type="submit"
                      isLoading={isSubmitting}
                      colorScheme="red"
                    >
                      Add Product
                    </Button>
                    <Button
                      mt={5}
                      width="full"
                      onClick={() => window.location.href = '/admin'}
                      colorScheme="gray"
                    >
                      Cancel
                    </Button>
                  </form>
                </Box>
              </Box>
            </>
          )}
        </Formik>
      </Box>
    </div>
  );
}

export default NewProduct;
