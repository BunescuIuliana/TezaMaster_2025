const uploadImage = async (image) => {
  // Dacă primim un obiect File (de la input type="file")
  if (image instanceof File) {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        resolve({
          secure_url: event.target.result,
          public_id: `local_${Date.now()}`,
          original_filename: image.name,
          format: image.name.split('.').pop(),
          created_at: new Date().toISOString(),
          bytes: image.size,
          width: 0, // Poți adăuga detectarea dimensiunilor
          height: 0,
          url: event.target.result,
          status: "uploaded"
        });
      };
      reader.readAsDataURL(image);
    });
  }

  // Dacă primim doar numele imaginii (pentru imagini existente în assets)
  if (typeof image === 'string') {
    return {
      secure_url: `/assets/${image}`,
      public_id: `local_${image.replace(/\.[^/.]+$/, "")}`,
      original_filename: image,
      format: image.split('.').pop(),
      created_at: new Date().toISOString(),
      bytes: 0, // Dimensiunea nu e cunoscută fără un request
      width: 0,
      height: 0,
      url: `/assets/${image}`,
      status: "exists"
    };
  }

  throw new Error('Format imagine neacceptat');
};

export default uploadImage;