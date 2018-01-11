module.exports = function(app, Book)
{
    // GET ALL BOOKS
    app.get('/api/books', function(req,res){
        Book.find(function(err, books){
            if(err) return res.status(500).send({error: 'database failure'});
            res.json(books);
        })
    });

    // GET SINGLE BOOK
    app.get('/api/books/:book_id', function(req, res){
        Book.findOne({_id: req.params.book_id}, function(err, book){
            if(err) return res.status(500).json({error: err});
            if(!book) return res.status(404).json({error: 'book not found'});
            res.json(book);
        })
    });

    // GET BOOK BY AUTHOR
    app.get('/api/books/author/:author', function(req, res){
        Book.find({author: req.params.author}, {_id: 0, title: 1, published_date: 1},  function(err, books){
            if(err) return res.status(500).json({error: err});
            if(books.length === 0) return res.status(404).json({error: 'book not found'});
            res.json(books);
        })
    });
    // GET 10 SCORES
    app.post('/api/scores2',function(req,res){
	console.log("scores2");
	Book.find({mode: req.body.mode}).sort({"score":-1}).skip(9).limit(1).exec(function(err,docs){
	if(err){
		console.error(err);
		res.json({result: 0});
		return ;
		}
		res.json(docs);
		});
	});
    // CREATE BOOK
    app.post('/api/scores', function(req, res){
        var book = new Book();
        book.nickname = req.body.nickname;
        book.score = req.body.score;
        book.mode = req.body.mode;
	console.log(req.body);
	book.save(function(err){
            if(err){
                console.error(err);
                res.json({result: 0});
                return;
            }
/*		
	Book.find({mode: req.body.mode},{$sort: {score: -1}},function(err,Book){
		if(err) return status(500).send({error: 'database failure'});	
		res.json(Book);
		console.log("All sent");
		})
*/	
	Book.find({mode: req.body.mode}).sort({"score": -1}).limit(10).exec(function(err,docs){
	if(err){
		console.error(err);
		res.json({result: 0});
		return ;
		}
	res.json(docs);
	});
        });
});
	// GET !0 SCORES
   app.post('/api/scores3', function(req, res){
	Book.find({mode: req.body.mode}).sort({"score":-1}).limit(10).exec(function(err, docs){
	if(err){
		console.error(err);
		res.json({result: 0});
		return ;
		}
		res.json(docs);
		});
	});   




 // UPDATE THE BOOK
    app.put('/api/books/:book_id', function(req, res){
        Book.update({ _id: req.params.book_id }, { $set: req.body }, function(err, output){
            if(err) res.status(500).json({ error: 'database failure' });
            console.log(output);
            if(!output.n) return res.status(404).json({ error: 'book not found' });
            res.json( { message: 'book updated' } );
        })
    /* [ ANOTHER WAY TO UPDATE THE BOOK ]
            Book.findById(req.params.book_id, function(err, book){
            if(err) return res.status(500).json({ error: 'database failure' });
            if(!book) return res.status(404).json({ error: 'book not found' });

            if(req.body.title) book.title = req.body.title;
            if(req.body.author) book.author = req.body.author;
            if(req.body.published_date) book.published_date = req.body.published_date;

            book.save(function(err){
                if(err) res.status(500).json({error: 'failed to update'});
                res.json({message: 'book updated'});
            });

        });
    */
    });

    // DELETE BOOK
    app.delete('/api/books/:book_id', function(req, res){
        Book.remove({ _id: req.params.book_id }, function(err, output){
            if(err) return res.status(500).json({ error: "database failure" });

            /* ( SINCE DELETE OPERATION IS IDEMPOTENT, NO NEED TO SPECIFY )
            if(!output.result.n) return res.status(404).json({ error: "book not found" });
            res.json({ message: "book deleted" });
            */

            res.status(204).end();
        })
    });
     
}


