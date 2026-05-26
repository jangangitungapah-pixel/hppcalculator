import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';

export const CalculatorHelpCard = ({ t }) => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleItem = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const helpItems = [
    {
      title: 'HPP (Harga Pokok Penjualan)',
      desc: 'HPP adalah total modal yang dikeluarkan untuk membuat satu unit produk siap jual. Ini dihitung dari total biaya dibagi jumlah produk yang berhasil diproduksi (tidak termasuk produk gagal).'
    },
    {
      title: 'Margin Keuntungan',
      desc: 'Margin adalah persentase keuntungan yang dihitung dari harga jual. Formulanya: ((Harga Jual - HPP) / Harga Jual) x 100%. Berguna untuk membandingkan profit dengan harga jual di pasar.'
    },
    {
      title: 'Markup Harga',
      desc: 'Markup adalah persentase kenaikan harga yang ditambahkan ke HPP. Formulanya: ((Harga Jual - HPP) / HPP) x 100%. Contoh, jika HPP Rp10.000 dengan markup 50%, maka harga jual menjadi Rp15.000.'
    }
  ];

  return (
    <div className="calculator-help-card">
      <div className="flex items-center gap-2 mb-3.5 pb-2 border-b border-border/50 text-text-primary">
        <HelpCircle className="w-5 h-5 text-brand-primary shrink-0" />
        <h3 className="font-bold text-sm">Panduan Istilah Keuangan</h3>
      </div>
      
      <div className="space-y-1">
        {helpItems.map((item, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div key={idx} className="calculator-help-item">
              <button
                type="button"
                onClick={() => toggleItem(idx)}
                aria-expanded={isOpen}
                className="w-full flex justify-between items-center text-left py-2 font-bold text-xs text-text-primary hover:text-brand-primary transition-colors focus:outline-none"
              >
                <span>{item.title}</span>
                {isOpen ? (
                  <ChevronUp className="w-3.5 h-3.5 opacity-60" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5 opacity-60" />
                )}
              </button>
              
              {isOpen && (
                <p className="calculator-help-text mt-1.5 pl-0 text-text-secondary leading-relaxed font-medium">
                  {item.desc}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
