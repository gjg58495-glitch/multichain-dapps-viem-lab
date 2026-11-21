"use client";

import { useState } from "react";
import { isAddress } from "viem";
import type { Address } from "viem";
import { contractAbi } from "./abi";
import { ConnectPublicClient, ensureSepolia, readableError } from "./client";

const TEACHER_ERC721 = "0xae2a37b60b7af7fcca8167df617f82a34f22719c";

export default function TokenComponent() {
  const [contractAddress, setContractAddress] = useState(TEACHER_ERC721);
  const [tokenId, setTokenId] = useState("1");
  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [owner, setOwner] = useState("");
  const [ownerError, setOwnerError] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function read() {
    setError(""); setName(""); setSymbol(""); setOwner(""); setOwnerError("");
    if (!isAddress(contractAddress)) {
      setError("Введите корректный адрес контракта ERC-721."); return;
    }
    if (!/^\d+$/.test(tokenId)) {
      setError("ID токена должен быть неотрицательным целым числом."); return;
    }
    setLoading(true);
    try {
      await ensureSepolia();
      const client = ConnectPublicClient();
      const address = contractAddress as Address;
      const [contractName, contractSymbol] = await Promise.all([
        client.readContract({ address, abi: contractAbi, functionName: "name" }),
        client.readContract({ address, abi: contractAbi, functionName: "symbol" }),
      ]);
      setName(contractName);
      setSymbol(contractSymbol);
      try {
        const tokenOwner = await client.readContract({ address, abi: contractAbi, functionName: "ownerOf", args: [BigInt(tokenId)] });
        setOwner(tokenOwner);
      } catch {
        setOwnerError("Для указанного ID владелец не получен. Возможно, токен не существует.");
      }
    } catch (e) {
      setError(readableError(e));
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="card" id="erc721">
      <h2>3. Чтение контракта ERC-721</h2>
      <p className="muted">Пример адреса из задания преподавателя. Читаем функции name(), symbol(), ownerOf(tokenId) через ABI.</p>
      <label htmlFor="nftaddress">Адрес контракта</label>
      <input id="nftaddress" value={contractAddress} onChange={e => setContractAddress(e.target.value)} spellCheck={false} />
      <label htmlFor="tokenid">ID токена</label>
      <input id="tokenid" value={tokenId} onChange={e => setTokenId(e.target.value)} inputMode="numeric" />
      <button type="button" disabled={loading} onClick={read}>{loading ? "Чтение..." : "Получить данные NFT"}</button>
      {(name || symbol) && <div className="result"><p>Название: <b>{name}</b></p><p>Символ: <b>{symbol}</b></p>{owner && <p className="mono">Владелец NFT #{tokenId}: {owner}</p>}{ownerError && <p className="note">{ownerError}</p>}</div>}
      {error && <p className="error" role="alert">{error}</p>}
      <p className="small"><a href={`https://sepolia.etherscan.io/address/${contractAddress}`} target="_blank" rel="noreferrer">Посмотреть контракт на Etherscan</a></p>
    </section>
  );
}
