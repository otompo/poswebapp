import Head from 'next/head';

const Layout = ({ children, title = 'POS' }) => {
  return (
    <div>
      <Head>
        <title>{title}</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta
          name="description"
          content="Users of this application can manage their 
          products instock,
          products about to go out ofstock, 
          products outstock,
          products about expire,
          products expired
          export and import products in CSV formart"
        />
        <meta
          property="og:title"
          content="Code Smart Point of Sales (POS) is the best POS for you when it comes to managing your shop.
           Manage and track your daily tractions, contact us for on 0245656347/0209576439 "
        />
        <meta
          property="og:description"
          content="Users of this application can manage their 
          products instock,
          products about to go out ofstock, 
          products outstock,
          products about expire,
          products expired
          export and import products in CSV formart
          "
        />

        <meta property="og:site_name" content="CODE SMART WEBSOFT" />
        <meta
          property="og:image"
          content="https://codesmartwebsoft.com/img/default.png"
        />
        <meta
          property="og:image:secure_url"
          content="https://codesmartwebsoft.com/img/default.png"
        />
      </Head>
      {/* <Navbar /> */}
      {children}

      {/* <Footer /> */}
    </div>
  );
};
export default Layout;
