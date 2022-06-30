package br.ifba.edu.apichamados.resource;
import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import br.ifba.edu.apichamados.model.Usuario;
import br.ifba.edu.apichamados.repositories.UsuarioRepository;

@RestController
@RequestMapping(path = "/usuarios")
public class UsuarioResource {

	@Autowired
	private UsuarioRepository usuarioRepository;

	public UsuarioResource(UsuarioRepository UsuarioRepository) {
		this.usuarioRepository = UsuarioRepository;
	}

	@PostMapping
	public ResponseEntity<Usuario> save(@RequestBody Usuario Usuario) {
		usuarioRepository.save(Usuario);
		return new ResponseEntity<>(Usuario, HttpStatus.OK);
	}

	@GetMapping
	public ResponseEntity<List<Usuario>> getAll() {
		List<Usuario> usuarios = new ArrayList<>();
		usuarios = usuarioRepository.findAll();
		return new ResponseEntity<>(usuarios, HttpStatus.OK);
	}

	@GetMapping(path = "/{id}")
	public ResponseEntity<Optional<Usuario>> getById(@PathVariable Integer id) {
		Optional<Usuario> usuario;
		try {
			usuario = usuarioRepository.findById(id);
			return new ResponseEntity<Optional<Usuario>>(usuario, HttpStatus.OK);
		} catch (NoSuchElementException nsee) {
			return new ResponseEntity<Optional<Usuario>>(HttpStatus.NOT_FOUND);
		}
	}

	@DeleteMapping(path = "/{id}")
	public ResponseEntity<Optional<Usuario>> deleteById(@PathVariable Integer id) {
		try {
			usuarioRepository.deleteById(id);
			return new ResponseEntity<Optional<Usuario>>(HttpStatus.OK);
		} catch (NoSuchElementException nsee) {
			return new ResponseEntity<Optional<Usuario>>(HttpStatus.NOT_FOUND);
		}
	}

	@PutMapping(value = "/{id}")
	public ResponseEntity<Usuario> update(@PathVariable Integer id,@RequestBody Usuario newUsuario){
		return usuarioRepository.findById(id).map(usuario -> {
			BeanUtils.copyProperties(newUsuario, usuario, "id");
			Usuario usuarioUpdated = usuarioRepository.save(usuario);
			return ResponseEntity.ok().body(usuarioUpdated);
		}).orElse(ResponseEntity.notFound().build());
	}

}
