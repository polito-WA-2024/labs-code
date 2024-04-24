'use strict';

function Film(id, title, isFavorite = false, watchDate, rating = 0) {
    this.id = id;
    this.title = title;
    this.favorite = isFavorite;
    this.rating = rating;
    // saved as dayjs object only if watchDate is truthy
    this.watchDate = watchDate && dayjs(watchDate);

    // Filters
    this.isFavorite =   () => { return this.favorite; }
    this.isBestRated =  () => { return this.rating === 5; }

    this.isSeenLastMonth = () => {
        if(!this.watchDate) return false;         // no watchDate
        const diff = this.watchDate.diff(dayjs(),'month')
        const ret = diff <= 0 && diff > -1 ;      // last month
        return ret;
    }

    this.isUnseen = () => {
        if(!this.watchDate) return true;     // no watchdate
        else return false;
    }
    
    this.toString = () => {
        return `Id: ${this.id}, ` +
        `Title: ${this.title}, Favorite: ${this.favorite}, ` +
        `Watch date: ${this.formatWatchDate('YYYY-MM-DD')}, ` +
        `Score: ${this.formatRating()}`;
    }
  
    this.formatWatchDate = (format) => {
        return this.watchDate ? this.watchDate.format(format) : '<not defined>';
    }
  
    this.formatRating = () => {
        return this.rating ? this.rating : '<not assigned>';
    }
}

function FilmLibrary() {
    this.list = [];

    this.add = (film) => {
        this.list = [...this.list, film];
        
        /*
        if (!this.list.some(f => f.id == film.id))
            this.list = [...this.list, film];
        else throw new Error('Duplicate id');
        */
    };

    // In the following methods we are using the "filter" method.
    // This method RETURNS A COPY of the "list" array, not the array itself, so we PRESERVE THE ORIGINAL array.

    this.filterAll = () => {
        return this.list.filter( () => true);
    }

    this.filterByFavorite = () => {
        return this.list.filter( (film) => film.isFavorite() );
    }

    this.filterByBestRated = () => {
        return this.list.filter( (film) => film.isBestRated() );
    }

    this.filterBySeenLastMonth = () => {
        return this.list.filter( (film) => film.isSeenLastMonth() );
    }

    this.filterByUnseen = () => {
        return this.list.filter( (film) => film.isUnseen() );
    }

    // This function permanently delete one element from the library
    this.delete = (id) => {
        this.list = this.list.filter( f => f.id != id );
    }

}

export { Film, FilmLibrary };