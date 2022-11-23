import sanityClient from '@sanity/client';
// dont make the mistake they are not the same
import imageUrlBuilder from '@sanity/image-url';

// note evry variable in your .env must start with REACT_APP_ else it won't work or see it to access

export const client =sanityClient({
    projectId:process.env.REACT_APP_SANITY_PROJECT_ID,
    dataset:'production',
    apiVersion:'2022-11-19',
    useCdn:true,
    token:process.env.REACT_APP_SANITY_TOKEN
});
// all this are in the documentation
const builder=imageUrlBuilder(client)
export const urlfor=(source)=>builder.image(source);