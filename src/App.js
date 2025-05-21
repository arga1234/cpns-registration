import React, { useState } from "react";
import { Spin, Form, Input, Button, Typography, Card, Modal } from "antd";
import { IdcardOutlined } from "@ant-design/icons";
import "antd/dist/reset.css";
import "./App.css";
import { db } from "./firebase";
import { doc, getDoc, updateDoc, addDoc, collection, serverTimestamp } from "firebase/firestore";

const { Title } = Typography;

export default function CPNSRegistrationPage() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    const { noPeserta } = values;

    setLoading(true);
    try {
      const docRef = doc(db, "peserta-cpns-v2", noPeserta);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        Modal.error({
          title: "Data tidak ditemukan",
          content: "Nomor peserta tidak terdaftar.",
        });
        // log: not found
        await addDoc(collection(db, "logs"), {
          event: "lookup_failed",
          noPeserta,
          timestamp: serverTimestamp(),
        });
        return;
      }

      const data = docSnap.data();

      if (data.sudahJoin) {
        Modal.confirm({
          title: "Anda sudah terverifikasi.",
          okText: "Hubungi Admin",
          cancelText: "Tutup",
          onOk: () => {
            const pesan = encodeURIComponent(
              `Hai saya sudah terverifikasi di database namun saya belum join grup resmi CPNS Disdik.\n\nNama: ${data.nama}\nNomor Peserta: ${noPeserta}\nJabatan: ${data.jabatan}`
            );
            if (/iPhone|iPad|iPod|Macintosh/i.test(navigator.userAgent) || 
                (/Safari/i.test(navigator.userAgent) && !/Chrome/i.test(navigator.userAgent))) {
              window.location.href = `https://wa.me/6289524801052?text=${pesan}`;
            } else {
              window.open(`https://wa.me/6289524801052?text=${pesan}`, "_blank");
            }
          },
          content:
            "Anda telah Terverifkasi. Bila Anda sudah terverifikasi namun belum bergabung di grup resmi, silakan klik tombol Hubungi Admin.",
        });
        // log: already verified lookup
        await addDoc(collection(db, "logs"), {
          event: "lookup_verified",
          noPeserta,
          userData: data,
          timestamp: serverTimestamp(),
        });
      } else {
        Modal.confirm({
          title: "Anda belum terverifikasi",
          content:
            "Silahkan klik tombol 'Lanjut'",
          okText: "Lanjut",
          cancelText: "Tutup",
          onOk: () => {
            contactAdmin(data.nama, noPeserta, data.jabatan);
          },
        });
        // log: not yet verified lookup
        await addDoc(collection(db, "logs"), {
          event: "lookup_not_verified",
          noPeserta,
          userData: data,
          timestamp: serverTimestamp(),
        });
      }
    } catch (error) {
      Modal.error({
        title: "Terjadi kesalahan",
        content: error.message,
      });
      // log: error on lookup
      await addDoc(collection(db, "logs"), {
        event: "lookup_error",
        noPeserta: values.noPeserta,
        error: error.message,
        timestamp: serverTimestamp(),
      });
    } finally {
      setLoading(false);
    }
  };

  const contactAdmin = (namaLengkap, noPeserta, jabatan) => {
    Modal.confirm({
      title: "Anda belum terverifikasi",
      content:
        "Pastikan anda sudah menyiapkan WhatsApp aktif di Smartphone. Jika melanjutkan tahap ini, maka anda akan terverifikasi secara otomatis dan dialihkan ke kontak admin WA",
      okText: "Lanjutkan verifikasi",
      cancelText: "Batal",
      async onOk() {
        setLoading(true);
        try {
          const pesertaRef = doc(db, "peserta-cpns-v2", noPeserta);
          await updateDoc(pesertaRef, {
            sudahJoin: true,
          });

          // log: update join status
          await addDoc(collection(db, "logs"), {
            event: "update_sudahJoin",
            noPeserta,
            updatedFields: { sudahJoin: true },
            timestamp: serverTimestamp(),
          });

          const pesan = encodeURIComponent(
            `Hai saya sudah verifikasi diri lewat web verifikasi & pendaftaran grup resmi CPNS Disdik.\n\nNama: ${namaLengkap}\nNomor Peserta: ${noPeserta}\nJabatan: ${jabatan}`
          );
          if (/iPhone|iPad|iPod|Macintosh/i.test(navigator.userAgent) || 
              (/Safari/i.test(navigator.userAgent) && !/Chrome/i.test(navigator.userAgent))) {
            window.location.href = `https://wa.me/6289524801052?text=${pesan}`;
          } else {
            window.open(`https://wa.me/6289524801052?text=${pesan}`, "_blank");
          }

          Modal.destroyAll(); // Tutup semua modal
        } catch (error) {
          Modal.error({
            title: "Gagal mengupdate status",
            content: error.message,
          });
          // log: error on update
          await addDoc(collection(db, "logs"), {
            event: "update_error",
            noPeserta,
            error: error.message,
            timestamp: serverTimestamp(),
          });
        } finally {
          setLoading(false);
        }
      },
    });
  };

  const LoadingOverlay = () => (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "#000",
        opacity: 0.5,
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Spin size="large" />
    </div>
  );
  

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-100 to-blue-300 p-4">
      <div
        style={{
          background: "#f9f9f9",
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
        className="w-full max-w-md"
      >
        <Card style={{ padding: "20px", position: "relative", maxWidth: "500px" }} className="shadow-2xl rounded-2xl">
        {loading && <LoadingOverlay />}
          <div className="text-center mb-6">
            <img
              src="https://ugc.production.linktr.ee/86b68084-90b4-4ab6-8b3c-9914e088ef8e_Logo-Dinas-Pendidikan-DKI-Jakarta.png"
              alt="Logo DKI"
              className="w-20 h-20 mx-auto mb-2"
              style={{ width: "100px", marginBottom: "20px" }}
            />
            <Title level={2} className="!mb-0">
              Verifikasi & Pendaftaran Grup Resmi
            </Title>
            <p className="text-md text-gray-600">
              CPNS Dinas Pendidikan Provinsi DKI Jakarta
            </p>
          </div>

          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            requiredMark={false}
          >
            <Form.Item
              name="noPeserta"
              label="Nomor Peserta SKD/SKB (tanpa strip)"
              rules={[{ required: true, message: "Nomor peserta wajib diisi" }]}
            >
              <Input
                style={{ height: "45px" }}
                prefix={<IdcardOutlined />}
                placeholder="Contoh: 2025123456"
              />
            </Form.Item>
            <Form.Item style={{ margin: "0" }}>
              <Button
                style={{ width: "100%", height: "45px" }}
                type="primary"
                htmlType="submit"
              >
                Verifikasi Sekarang
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </div>
  );
}