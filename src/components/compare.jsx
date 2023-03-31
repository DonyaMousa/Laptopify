import { useState } from 'react';
import Modal from './Modal';

const Products = ({ filteredProducts }) => {
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [showCompareModal, setShowCompareModal] = useState(false);

  const handleCompare = (productId) => {
    const selectedProduct = filteredProducts.find((product) => product.id === productId)
    if (!selectedProducts.some((product) => product.id === productId)) {
      setSelectedProducts([...selectedProducts, selectedProduct])
    }
  }

  const handleCompareClick = () => {
    setShowCompareModal(true);
  }

  return (
    <div>
      {filteredProducts.map((product) => (
        <div key={product.id}>
          <h2>{product.name}</h2>
          <p>{product.price}</p>
          <button onClick={() => handleCompare(product.id)}>Compare</button>
        </div>
      ))}
      <button onClick={handleCompareClick}>Compare Selected Products</button>
      {showCompareModal && (
        <Modal>
          <CompareModal selectedProducts={selectedProducts} />
        </Modal>
      )}
    </div>
  );
};

const CompareModal = ({ selectedProducts }) => {
  return (
    <div>
      {selectedProducts.length > 0 ? (
        <table>
          <thead>
            <tr>
              {selectedProducts.map((product) => (
                <th key={product.id}>{product.name}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              {selectedProducts.map((product) => (
                <td key={product.id}>{product.price}</td>
              ))}
            </tr>
            <tr>
              {selectedProducts.map((product) => (
                <td key={product.id}>{product.details.color}</td>
              ))}
            </tr>
            <tr>
              {selectedProducts.map((product) => (
                <td key={product.id}>{product.details.size}</td>
              ))}
            </tr>
          </tbody>
        </table>
      ) : (
        <p>No products selected for comparison</p>
      )}
    </div>
  );
};

export default Products;






  