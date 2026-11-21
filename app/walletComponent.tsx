"use client";

import { useState } from "react";
import { formatEther } from "viem";
import { ConnectPublicClient, ConnectWalletClient, ensureSepolia, readableError, switchToSepolia } from "./client";

export default function WalletComponent() {
  const [address, setAddress] = useState("");
  const [balance, setBalance] = useState<bigint | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function connect() {
    setLoading(true);
    setError("");
    try {
      await ensureSepolia();
      const walletClient = ConnectWalletClient();
      const [account] = await walletClient.requestAddresses();
      if (!account) throw new Error("MetaMask не вернул адрес кошелька.");
      const value = await ConnectPublicClient().getBalance({ address: account });
      setAddress(account);
      setBalance(value);
    } catch (e) {
      setError(readableError(e));
    } finally {
      setLoading(false);
    }
  }

  async function switchNetwork() {
    setLoading(true);
    setError("");
    try {
      await switchToSepolia();
    } catch (e) {
      setError(readableError(e));
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="card" id="wallet">
      <h2>1. Подключение Web3-кошелька</h2>
      <p className="muted">Работа с MetaMask в тестовой сети Sepolia. Баланс отображается в ETH и Wei.</p>
      <div className="actions">
        <button type="button" disabled={loading} onClick={connect}>{loading ? "Проверка..." : "Подключить и проверить баланс"}</button>
        <button type="button" className="secondary" disabled={loading} onClick={switchNetwork}>Переключиться на Sepolia</button>
      </div>
      {address ? (
        <div className="result">
          <p><span className="dot good" /> <b>Подключено</b></p>
          <p className="mono">Адрес: {address}</p>
          <p>Баланс: <b>{balance === null ? "—" : formatEther(balance)} ETH</b></p>
          <p className="small">В Wei: {balance?.toString() ?? "—"}</p>
        </div>
      ) : <p className="status"><span className="dot" /> Кошелёк не подключён.</p>}
      {error && <p className="error" role="alert">{error}</p>}
    </section>
  );
}
