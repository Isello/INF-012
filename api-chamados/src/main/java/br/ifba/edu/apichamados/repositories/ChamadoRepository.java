package br.ifba.edu.apichamados.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Component;

import br.ifba.edu.apichamados.model.Chamado;
 
public interface ChamadoRepository extends JpaRepository<Chamado, Integer>{
	

}
