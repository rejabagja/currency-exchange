import { useState, useEffect } from "react";

function Thead() {
  return (
    <thead>
        <tr className="border-b-2 border-orange-200">
          <th className="text-center"></th>
          <th className="text-center p-4">We Buy</th> 
          <th className="text-center p-4">Exchange Rate</th>
          <th className="text-center p-4">We Sell</th>
        </tr>
        {/* webuy= 1.02, wesell=0.98 */}
    </thead>
  );
}

async function getCurrencyRates() {
  try {
    const apiUrl = import.meta.env.VITE_CURRENCY_API_BASE_URL + '/v2.0/rates/latest';
    const apiKey = import.meta.env.VITE_CURRENCY_API_KEY;
    const response = await fetch(`${apiUrl}?apikey=${apiKey}`);
    const {rates} = await response.json();
    return rates;
  } catch (error) {
    throw new Error(error.message);
  }
}

export default function CurrencyTable() {
  const [currencyRatesData, setCurrencyRatesData] = useState({});
  const [error, setError] = useState(null);

  const currenciesTarget = ["CAD", "IDR", "JPY", "CHF", "EUR", "GBP"];

  const formatNumber = (strNum) => {
    const [intPart, decimalPart] = strNum.split('.');
    const formattedInt = intPart.padStart(3, '0');
    return decimalPart ? `${formattedInt}.${decimalPart}` : decimalPart;
  }

  const calculateBuy = (rate) => {
    const result = (parseFloat(rate) * 1.02).toFixed(4);
    return formatNumber(result);
  }
  
  const calculateSell = (rate) => {
    const result = (parseFloat(rate) * 0.98).toFixed(4);
    return formatNumber(result);
  }

  useEffect(() => {
    getCurrencyRates()
      .then(data => setCurrencyRatesData(data))
      .catch(err => setError(err.message));
  }, [])

  if (error) return <p className="text-center text-xl text-gray-600">⚠{error}</p>

  return (
    <div className="container px-2 sm:px-4 mx-auto">
      <div className="overflow-x-auto">
        <table className="mx-auto min-w-96 w-full max-w-3xl bg-orange-500 text-white" >
          <Thead />
          <tbody>
            {
              currenciesTarget.map(currency => (
                  <tr key={currency} className="border-b border-orange-200">
                    <td className="text-center p-4 font-medium">{currency}</td>
                    <td className="text-center p-4">{calculateBuy(currencyRatesData[currency])}</td>
                    <td className="text-center p-4">{formatNumber(parseFloat(currencyRatesData[currency]).toFixed(4))}</td>
                    <td className="text-center p-4">{calculateSell(currencyRatesData[currency])}</td>
                  </tr>
                )
              )
            }
          </tbody>
        </table>
      </div>
    </div>
  )
}