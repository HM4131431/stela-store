import { useState } from 'react';

export default function AdminProducts() {
  const [image, setImage] = useState('');
  const [name, setName] = useState('');
  const [category, setCategory] = useState('میز');
  const [price, setPrice] = useState('');
  const [specs, setSpecs] = useState('');
  const [description, setDescription] = useState('');

  const publish = () => {
    const product = {
      id: Date.now(),
      image,
      name,
      category,
      price,
      specs,
      description,
    };

    const products = JSON.parse(localStorage.getItem('stela-products') || '[]');
    localStorage.setItem(
      'stela-products',
      JSON.stringify([...products, product])
    );

    alert('محصول با موفقیت منتشر شد');
    setImage('');
    setName('');
    setPrice('');
    setSpecs('');
    setDescription('');
  };

  return (
    <div className="min-h-screen px-6 py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-serif text-neutral-900 mb-2">
          مدیریت محصولات
        </h1>

        <p className="text-neutral-500 mb-10">
          افزودن محصول جدید به فروشگاه Stela Design
        </p>

        <div className="space-y-6">
          <div>
            <label className="block mb-2">عکس محصول</label>
            <input
              type="text"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="آدرس عکس محصول"
              className="w-full border border-neutral-300 p-4 rounded-xl"
            />
          </div>

          <div>
            <label className="block mb-2">نام محصول</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="مثلاً میز مدرن STELA"
              className="w-full border border-neutral-300 p-4 rounded-xl"
            />
          </div>

          <div>
            <label className="block mb-2">دسته‌بندی</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full border border-neutral-300 p-4 rounded-xl"
            >
              <option>میز</option>
              <option>شلف</option>
              <option>استند</option>
              <option>رگال لباس</option>
              <option>کتابخانه</option>
              <option>نیمکت</option>
            </select>
          </div>

          <div>
            <label className="block mb-2">قیمت</label>
            <input
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="مثلاً 2500000"
              className="w-full border border-neutral-300 p-4 rounded-xl"
            />
          </div>

          <div>
            <label className="block mb-2">مشخصات محصول</label>
            <textarea
              value={specs}
              onChange={(e) => setSpecs(e.target.value)}
              placeholder="ابعاد، متریال، رنگ و..."
              rows={5}
              className="w-full border border-neutral-300 p-4 rounded-xl"
            />
          </div>

          <div>
            <label className="block mb-2">توضیحات محصول</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="توضیحات کامل محصول..."
              rows={7}
              className="w-full border border-neutral-300 p-4 rounded-xl"
            />
          </div>

          <button
            onClick={publish}
            className="w-full py-4 rounded-xl bg-neutral-900 text-white text-lg hover:bg-neutral-700 transition"
          >
            انتشار محصول
          </button>
        </div>
      </div>
    </div>
  );
}
