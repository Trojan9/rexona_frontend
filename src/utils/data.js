export const userQuery =(userId)=>{
    // saity query
    const query=`*[_type == "user" && _id == '${userId}']`;
    
    return query;
}

export const searchQuery =(searchTerm)=>{
    // sanity query..then we specify which parameters we need just like in typeORM
    const query=`*[_type == "pins" && title match '${searchTerm}*' || category match '${searchTerm}*' || about match '${searchTerm}*']{
        image{
            asset->{
                url
            }
        },
        _id,
        destination,
        postedBy->{
            _id,
            userName,
            image
        },
        save[]{
            _key,
            postedBy->{
                _id,
                userName,
                image
            },
        },
    }`;
    
    return query;
}

export const FeedQuery = `*[_type == "pin"] | order(_createAt desc) {
    image{
        asset->{
            url
        }
    },
    _id,
    destination,
    postedBy->{
        _id,
        userName,
        image
    },
    save[]{
        _key,
        postedBy->{
            _id,
            userName,
            image
        },
    },
}`;