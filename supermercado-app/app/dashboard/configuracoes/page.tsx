
"use client"

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function ConfiguracoesPage() {
  const [preview, setPreview] = React.useState<string>("/placeholder-user.jpg");
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [message, setMessage] = React.useState<string>("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
      setMessage("");
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setMessage("Selecione uma imagem primeiro.");
      return;
    }
    setLoading(true);
    setMessage("");
    const formData = new FormData();
    formData.append("file", selectedFile);
    // Adiciona o userId ao FormData
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (user.id) {
      formData.append("userId", user.id.toString());
    } else {
      setMessage("Usuário não encontrado. Faça login novamente.");
      setLoading(false);
      return;
    }
    try {
      const res = await fetch("/api/user/profile-photo", {
        method: "POST",
        body: formData,
      });
      if (res.ok) {
        const data = await res.json();
        setMessage("Foto atualizada com sucesso!");
        if (data.url) {
          setPreview(data.url);
          // Atualiza localStorage e estado do usuário
          const updatedUser = { ...user, photoUrl: data.url };
          localStorage.setItem("user", JSON.stringify(updatedUser));
        }
      } else {
        setMessage("Erro ao enviar foto.");
      }
    } catch (err) {
      setMessage("Erro ao enviar foto.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Configurações</h1>
        <div className="max-w-lg mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Foto de Perfil</CardTitle>
              <CardDescription>Altere sua foto de perfil</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col items-center gap-4">
                <img
                  src={preview}
                  alt="Foto de perfil"
                  className="w-24 h-24 rounded-full object-cover border"
                />
                <input type="file" accept="image/*" className="block" onChange={handleFileChange} />
                <Button variant="default" className="w-full bg-green-600 hover:bg-green-700" onClick={handleUpload} disabled={loading}>
                  {loading ? "Salvando..." : "Salvar nova foto"}
                </Button>
                {message && <p className="text-sm text-center text-gray-600 mt-2">{message}</p>}
                <Button variant="secondary" className="w-full mt-4" onClick={() => window.location.href = "/dashboard"}>
                  Voltar para Home
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
