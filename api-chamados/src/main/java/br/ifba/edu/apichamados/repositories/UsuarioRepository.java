package br.ifba.edu.apichamados.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import br.ifba.edu.apichamados.model.Chamado;
import br.ifba.edu.apichamados.model.Usuario;

public interface UsuarioRepository extends JpaRepository<Usuario, Integer>{

}
