"use client";

import { useState } from "react";
import { formatUnits } from "viem";
import { wethAbi } from "./abi";
import { ConnectPublicClient, ensureSepolia, readableError } from "./client";

// Другой публичный контракт Sepolia: тестовый Wrapped Ether (WETH), стандарт ERC-20.
const WETH_SEPOLIA = "0x7b79995e5f793a07bc00c21412e50ecae098e7f9";

export default function ExtraContractComponent() {
  const [result, setResult] = useState<{ name: string; symbol: string; decimals: number; supply: string } | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function readContract() {
    setError(""); setResult(null); setLoading(true);
    try {
      await ensureSepolia();
      const client = ConnectPublicClient();
      const [name, symbol, decimals, supply] = await Promise.all([
        client.readContract({ address: WETH_SEPOLIA, abi: wethAbi, functionName: "name" }),
        client.readContract({ address: WETH_SEPOLIA, abi: wethAbi, functionName: "symbol" }),
        client.readContract({ address: WETH_SEPOLIA, abi: wethAbi, functionName: "decimals" }),
        client.readContract({ address: WETH_SEPOLIA, abi: wethAbi, functionName: "totalSupply" }),
      ]);
      setResult({ name, symbol, decimals, supply: formatUnits(supply, decimals) });
    } catch (e) { setError(readableError(e)); }
    finally { setLoading(false); }
  }

  return (
    <section className="card" id="extra">
      <h2>4. Самостоятельная работа: второй смарт-контракт</h2>
      <p className="muted">Пример самостоятельного задания: чтение другого публичного контракта Sepolia — WETH (ERC-20), функции name(), symbol(), decimals(), totalSupply().</p>
      <p className="mono small">Адрес: {WETH_SEPOLIA}</p>
      <button type="button" disabled={loading} onClick={readContract}>{loading ? "Чтение..." : "Прочитать данные WETH"}</button>
      {result && <div className="result"><p>Название: <b>{result.name}</b></p><p>Символ: <b>{result.symbol}</b></p><p>Знаков после запятой: {result.decimals}</p><p>Объём выпуска: {result.supply}</p></div>}
      {error && <p className="error" role="alert">{error}</p>}
      <p className="small"><a href={`https://sepolia.etherscan.io/address/${WETH_SEPOLIA}`} target="_blank" rel="noreferrer">Исходная страница контракта на Etherscan</a></p>
    </section>
  );
}
