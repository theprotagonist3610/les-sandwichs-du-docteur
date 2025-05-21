export function Price(articles, livraison, frais, reduction) {
  return (
    articles.reduce(
      (prev, curr) => (prev ? prev + curr?.prix : curr?.prix),
      0
    ) *
      (1 - reduction) +
    livraison +
    frais
  );
}
