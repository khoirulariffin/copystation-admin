import React, { useState } from "react";
import { MapPin, Phone, Mail, MessageSquare } from "lucide-react";
import PublicLayout from "@/components/layout/PublicLayout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const phoneNumber = "6281281891205";
    const formattedMessage = encodeURIComponent(
      `Halo, saya ${formData.name}!\n\n${formData.message}\n\nThank you!`
    );
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${formattedMessage}`;

    window.open(whatsappUrl, "_blank");
    toast.success("Membuka WhatsApp...");
    setFormData({ name: "", message: "" });
  };

  const openWhatsApp = () => {
    const phoneNumber = "6281281891205"; // WhatsApp number format (remove + and spaces)
    const message = encodeURIComponent(
      "Hai, saya ingin bertanya tentang layanan Fotokopi Sabilillah."
    );
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

    window.open(whatsappUrl, "_blank");
    toast.success("Opening WhatsApp chat");
  };

  return (
    <PublicLayout>
      <div className="">
        <div className="text-center px-4 pt-24 pb-8 mb-8 bg-gradient-to-r from-blue-700 to-blue-900">
          <h1 className="text-4xl font-bold mb-4 text-white">Hubungi Kami</h1>
          <p className="text-lg text-gray-200 max-w-3xl mx-auto">
            Punya pertanyaan atau butuh bantuan? Hubungi kami melalui berbagai
            saluran berikut atau isi formulir kontak di bawah ini.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16 mx-4">
          <div>
            <div className="glass-panel rounded-lg p-8 mb-8">
              <h2 className="text-2xl font-bold mb-6">Informasi Kontak</h2>

              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="mr-4 bg-primary/10 p-3 rounded-full">
                    <MapPin className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Lokasi Kami</h3>
                    <p className="text-gray-600">
                      Jl. Sabilillah
                      <br />
                      Medan Satria, Kota Bekasi
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="mr-4 bg-primary/10 p-3 rounded-full">
                    <Phone className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Nomor Telepon</h3>
                    <p className="text-gray-600">(+62) 812-8189-1205</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="mr-4 bg-primary/10 p-3 rounded-full">
                    <Mail className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Alamat Email</h3>
                    <p className="text-gray-600">
                      fotokopisabilillah@gmail.com
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="glass-panel rounded-lg p-8">
              <h2 className="text-2xl font-bold mb-6">Jam Operasional</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="font-medium">Senin - Sabtu:</span>
                  <span>08:00 - 20:00</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Minggu:</span>
                  <span>Tutup</span>
                </div>
              </div>
            </div>
          </div>

          <div className="glass-panel rounded-lg p-8">
            <h2 className="text-2xl font-bold mb-6">Kirim Pesan</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium mb-1"
                >
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium mb-1"
                >
                  Pesan Anda
                </label>
                <Textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  className="w-full min-h-[150px]"
                />
              </div>

              <Button type="submit" className="w-full">
                Kirim Pesan
              </Button>
            </form>

            <div className="mt-8 pt-8 border-t">
              <p className="text-center mb-4">
                Atau hubungi kami langsung melalui WhatsApp
              </p>
              <Button
                variant="outline"
                className="w-full"
                onClick={openWhatsApp}
              >
                <MessageSquare className="mr-2 h-4 w-4" />
                Chat WhatsApp
              </Button>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
};

export default ContactPage;
