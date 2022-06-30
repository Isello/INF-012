package br.ifba.edu.apichamados.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import br.ifba.edu.apichamados.model.Cliente;

public interface ClienteRepository extends JpaRepository<Cliente, Integer>{

}
