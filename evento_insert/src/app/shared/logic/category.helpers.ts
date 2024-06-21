import { Category, Subcategory } from "../../globals/models/category";

export const transformFormFieldToCategory = (
  type: "Category" | "Subcategory",
  categoryForm,
  categoryUpdateId: string
) => {
  let category;
  if (type === "Category") {
    category = new Category();
  } else {
    category = new Subcategory();
  }

  Object.keys(categoryForm.controls).forEach((key) => {
    category[key] = categoryForm.controls[key].value;
  });

  if (categoryUpdateId) category._id = categoryUpdateId;

  return category;
};
