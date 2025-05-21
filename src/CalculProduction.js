export function calculIngredients(principal, model) {
  let res = {};
  res.ingredientPrincipal = {
    ...model.ingredientPrincipal,
    quantite: principal,
  };
  res.ingredientsSecondaires = model.ingredientsSecondaires.map(
    (el) => new Object({ ...el, quantite: principal * parseFloat(el.quantite) })
  );
  res.utilitaires = model.utilitaires;
  return res;
}
