import React from "react";
import { Info, Users, Award, Clock } from "lucide-react";
import PublicLayout from "@/components/layout/PublicLayout";
import { Separator } from "@/components/ui/separator";

const AboutPage: React.FC = () => {
  return (
    <PublicLayout>
      <div className="">
        <div className="text-center px-4 pt-24 pb-8 mb-8 bg-gradient-to-r from-blue-700 to-blue-900">
          <h1 className="text-4xl font-bold mb-4 text-white">Tentang Kami</h1>
          <p className="text-lg text-gray-200 max-w-3xl mx-auto">
            Fotokopi Sabilillah menyediakan layanan percetakan berkualitas dan
            perlengkapan alat tulis untuk kebutuhan pendidikan dan kantor Anda.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16 px-4 lg:px-8">
          <div className="glass-panel rounded-lg p-8">
            <h2 className="text-2xl font-bold mb-4">Sejarah Kami</h2>
            <p className="text-gray-600 mb-4">
              Berdiri sejak tahun 2018, Fotokopi Sabilillah dimulai sebagai
              bisnis keluarga dengan tujuan sederhana: melayani masyarakat
              sekitar dengan layanan percetakan yang andal dan perlengkapan alat
              tulis berkualitas.
            </p>
            <p className="text-gray-600">
              Seiring berjalannya waktu, kami telah berkembang menjadi nama yang
              dipercaya di Medan Satria, Bekasi, menyediakan solusi lengkap
              untuk pelajar, profesional, dan pelaku bisnis.
            </p>
          </div>

          <div className="glass-panel rounded-lg p-8">
            <h2 className="text-2xl font-bold mb-4">Misi Kami</h2>
            <p className="text-gray-600 mb-4">
              Misi kami adalah menyediakan layanan percetakan dan produk alat
              tulis berkualitas tinggi dengan harga terjangkau, didukung layanan
              pelanggan yang melampaui harapan.
            </p>
            <p className="text-gray-600">
              Kami berkomitmen untuk bertanggung jawab terhadap lingkungan dalam
              operasional kami sambil memenuhi berbagai kebutuhan masyarakat
              dengan integritas dan dedikasi.
            </p>
          </div>
        </div>

        <Separator className="my-16" />

        <h2 className="text-3xl font-bold text-center mb-12">
          Mengapa Memilih Kami?
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 px-4 lg:px-8">
          <div className="flex flex-col items-center text-center p-6 hover-card rounded-lg">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <Info className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Layanan Berkualitas</h3>
            <p className="text-gray-600">
              Kami bangga memberikan kualitas terbaik dalam setiap layanan kami,
              mulai dari percetakan hingga pemilihan produk.
            </p>
          </div>

          <div className="flex flex-col items-center text-center p-6 hover-card rounded-lg">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <Users className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Fokus pada Pelanggan</h3>
            <p className="text-gray-600">
              Pelanggan adalah prioritas kami. Kami mendengarkan kebutuhan Anda
              dan berusaha melampaui harapan Anda setiap waktu.
            </p>
          </div>

          <div className="flex flex-col items-center text-center p-6 hover-card rounded-lg">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <Award className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Komitmen</h3>
            <p className="text-gray-600">
              Kami berkomitmen untuk memberikan pelayanan terbaik dengan
              integritas dan dedikasi penuh dalam setiap aspek layanan kami.
            </p>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
};

export default AboutPage;
